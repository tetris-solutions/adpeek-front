import assign from 'lodash/assign'
import debounce from 'lodash/debounce'
import diff from 'lodash/difference'
import find from 'lodash/find'
import includes from 'lodash/includes'
import isArray from 'lodash/isArray'
import isEmpty from 'lodash/isEmpty'
import map from 'lodash/map'
import findIndex from 'lodash/findIndex'
import pick from 'lodash/pick'
import uniq from 'lodash/uniq'
import React from 'react'
import reportEntityType from '../../../../propTypes/report-entity'
import reportModuleType from '../../../../propTypes/report-module'
import Editor from './Editor'

const {PropTypes} = React

const editableFields = ['name', 'type', 'dimensions', 'metrics', 'rows', 'cols', 'entity', 'limit', 'sort', 'filters']

const ModuleEdit = React.createClass({
  displayName: 'Editor-Controller',

  contextTypes: {
    attributes: PropTypes.object.isRequired,
    messages: PropTypes.object.isRequired,
    locales: PropTypes.string.isRequired,
    moment: PropTypes.func.isRequired,
    module: PropTypes.object.isRequired,
    entities: PropTypes.array.isRequired
  },
  propTypes: {
    close: PropTypes.func,
    save: PropTypes.func
  },
  childContextTypes: {
    draft: PropTypes.shape({
      module: reportModuleType,
      entity: reportEntityType
    }),
    addEntity: PropTypes.func,
    removeEntity: PropTypes.func,
    addAttribute: PropTypes.func,
    removeAttribute: PropTypes.func,
    change: PropTypes.func,
    onChangeProperty: PropTypes.func
  },
  getChildContext () {
    return {
      draft: {
        module: this.getDraftModule(),
        entity: this.getDraftEntity()
      },
      change: this.change,
      onChangeProperty: this.onChangeProperty,
      addAttribute: this.addAttribute,
      removeAttribute: this.removeAttribute,
      addEntity: this.addEntity,
      removeEntity: this.removeEntity
    }
  },
  getInitialState () {
    const snapshot = pick(this.context.module, editableFields)

    return {
      oldModule: snapshot,
      newModule: snapshot
    }
  },
  componentWillMount () {
    this.updateQueue = []
    this.persist = debounce(this.flushUpdateQueue, 500)
  },
  flushUpdateQueue () {
    this.change(assign({}, ...this.updateQueue), true)
    this.updateQueue = []
  },
  enqueueUpdate (update) {
    this.updateQueue.push(update)
    this.persist()
  },
  onChangeProperty ({target: {type, name, value}}) {
    if (type === 'number') {
      value = isNaN(Number(value)) ? 0 : Number(value)
    }

    const newState = {[name]: value}
    const module = this.getDraftModule()

    if (name === 'entity') {
      newState.dimensions = []
      newState.metrics = []
      newState.filters = {id: []}
    }

    if (name === 'type' && (value === 'pie' || value === 'total')) {
      const {dimensions, metrics} = module

      if (dimensions.length > 1) {
        newState.dimensions = value === 'total' ? [] : [dimensions[0]]
      }

      if (metrics.length > 1) {
        newState.metrics = [metrics[0]]
      }
    }

    this.enqueueUpdate(newState)
  },
  removeEntity (id) {
    const ids = isArray(id) ? id : [id]
    const module = this.getDraftModule()

    this.change({
      filters: assign({}, module.filters, {
        id: module.filters.id.filter(currentId => !includes(ids, currentId))
      })
    })
  },
  addEntity (id) {
    const ids = isArray(id) ? id : [id]
    const module = this.getDraftModule()
    const filters = assign({}, module.filters, {
      id: uniq(module.filters.id.concat(ids))
    })
    this.change({filters})
  },
  removeAttribute (_attribute_, forceRedraw = false) {
    const {attributes} = this.context
    const removedAttributesIds = isArray(_attribute_) ? _attribute_ : [_attribute_]
    const module = this.getDraftModule()
    const goesWithoutId = id => !find(attributes, {id}).requires_id

    const changes = {
      dimensions: module.dimensions.concat(),
      metrics: module.metrics.concat(),
      sort: module.sort
    }

    function remove (attribute, ls) {
      const ids = [attribute.id]

      const sortingIndex = findIndex(changes.sort, ([field]) => field === attribute.id)

      if (sortingIndex > -1) {
        changes.sort = changes.sort.concat()
        changes.sort.splice(sortingIndex, 1)
      }

      return ls.filter(id => !includes(ids, id))
    }

    function removeAttributeFromSelectionStateAndApplyRules (attributeId) {
      const attribute = find(attributes, {id: attributeId})

      if (attribute.is_dimension) {
        changes.dimensions = remove(attribute, changes.dimensions)
      }

      if (attribute.is_metric) {
        changes.metrics = remove(attribute, changes.metrics)
      }

      if (attributeId === 'id') {
        changes.dimensions = changes.dimensions.filter(goesWithoutId)
        changes.metrics = changes.metrics.filter(goesWithoutId)
      }
    }

    removedAttributesIds.forEach(removeAttributeFromSelectionStateAndApplyRules)

    changes.dimensions = uniq(changes.dimensions)
    changes.metrics = uniq(changes.metrics)

    this.change(changes, forceRedraw)
  },
  addAttribute (_attribute_) {
    const {attributes} = this.context
    const selectedAttributeIds = isArray(_attribute_) ? _attribute_ : [_attribute_]
    const module = this.getDraftModule()
    const getAttributeById = value => find(attributes, {id: value})
    const changes = {
      dimensions: module.dimensions.concat(),
      metrics: module.metrics.concat()
    }

    function add (attribute, ls) {
      if (module.type === 'pie' || module.type === 'total') {
        return [attribute.id] // override current selection
      }

      if (attribute.requires) {
        return ls // include all the required attributes
          .concat(attribute.requires)
          .concat([attribute.id])
      }

      return ls.concat([attribute.id])
    }

    function addAttributeToSelectionState (attributeId) {
      const attribute = getAttributeById(attributeId)

      if (attribute.is_dimension) {
        changes.dimensions = add(attribute, changes.dimensions)
      }

      if (attribute.is_metric) {
        changes.metrics = add(attribute, changes.metrics)
      }
    }

    selectedAttributeIds.forEach(addAttributeToSelectionState)

    changes.dimensions = uniq(changes.dimensions)
    changes.metrics = uniq(changes.metrics)

    this.change(changes)
  },
  change (changes, forceRedraw = false) {
    const newModule = assign({}, this.state.newModule, changes)
    const redrawIfNecessary = () => {
      if (forceRedraw || changes.sort) {
        this.redraw()
      }
    }

    this.setState({newModule}, redrawIfNecessary)
  },
  cancel () {
    this.props.save(this.state.oldModule)
    this.props.close()
  },
  save () {
    const draftModule = assign({}, this.state.newModule)
    const ids = map(this.getDraftEntity().list, 'id')
    const fullSelection = diff(ids, draftModule.filters.id).length === 0

    if (fullSelection) {
      draftModule.filters = assign({}, draftModule.filters)
      draftModule.filters.id = []
    }

    this.props.save(draftModule, true)
    this.props.close()
  },
  redraw () {
    this.props.save(this.state.newModule)
  },
  getDraftModule () {
    return assign({}, this.context.module, this.state.newModule)
  },
  getDraftEntity () {
    return find(this.context.entities, {id: this.state.newModule.entity})
  },
  render () {
    const {name, type, dimensions, metrics, filters} = this.getDraftModule()

    const isInvalidModule = isEmpty(name) || (
        isEmpty(dimensions) &&
        type !== 'total'
      ) ||
      isEmpty(metrics) ||
      isEmpty(filters.id)

    return (
      <Editor
        isInvalid={isInvalidModule}
        isLoading={Boolean(this.context.module.isLoading)}
        cancel={this.cancel}
        redraw={this.redraw}
        save={this.save}/>
    )
  }
})

export default ModuleEdit
