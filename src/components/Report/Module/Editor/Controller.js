import assign from 'lodash/assign'
import debounce from 'lodash/debounce'
import diff from 'lodash/difference'
import find from 'lodash/find'
import includes from 'lodash/includes'
import isArray from 'lodash/isArray'
import isEmpty from 'lodash/isEmpty'
import map from 'lodash/map'
import pick from 'lodash/pick'
import uniq from 'lodash/uniq'
import Message from 'tetris-iso/Message'
import React from 'react'
import reportEntityType from '../../../../propTypes/report-entity'
import reportModuleType from '../../../../propTypes/report-module'
import DateRangeButton from '../../DateRange'
import Lists from './Lists'
import Size from './Size'
import Filters from './Filters'
import Preview from './Preview'
import {Tabs, Tab} from '../../../Tabs'
import {styled} from '../../../mixins/styled'
import csjs from 'csjs'

const {PropTypes} = React
const style = csjs`
.leftCol {
  height: calc(80vh + 40px);
  overflow-y: auto;
}
.rightButtons {
  float: right;
  margin-right: 1em
}`
const editableFields = ['name', 'type', 'dimensions', 'metrics', 'rows', 'cols', 'entity', 'limit', 'sort', 'filters']

const ModuleEdit = React.createClass({
  displayName: 'Module-Editor',
  mixins: [styled(style)],
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
    update: PropTypes.func,
    onChangeProperty: PropTypes.func
  },
  getChildContext () {
    return {
      draft: {
        module: this.getDraftModule(),
        entity: this.getDraftEntity()
      },
      update: this.update,
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
    this.update(assign({}, ...this.updateQueue), true)
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

    this.update({
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
    this.update({filters})
  },
  removeAttribute (_attribute_, forceReload = false) {
    const {attributes} = this.context
    const removedAttributesIds = isArray(_attribute_) ? _attribute_ : [_attribute_]
    const module = this.getDraftModule()
    const goesWithoutId = id => !find(attributes, {id}).requires_id

    const changes = {
      dimensions: module.dimensions.concat(),
      metrics: module.metrics.concat()
    }

    function remove (attribute, ls) {
      const ids = [attribute.id]

      if (attribute.required_by) {
        ids.splice(ids.length, 0, ...attribute.required_by)
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

    this.update(changes, forceReload)
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

    this.update(changes)
  },
  update (changes, forceReload = false) {
    const newModule = assign({}, this.state.newModule, changes)
    const reloadIfNecessary = () => {
      if (forceReload || changes.sort) {
        this.reload()
      }
    }

    this.setState({newModule}, reloadIfNecessary)
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
  reload () {
    this.props.save(this.state.newModule)
  },
  getDraftModule () {
    return assign({}, this.context.module, this.state.newModule)
  },
  getDraftEntity () {
    return find(this.context.entities, {id: this.state.newModule.entity})
  },
  render () {
    const draftModule = this.getDraftModule()
    const draftEntity = this.getDraftEntity()
    const {messages} = this.context

    const isInvalidModule = isEmpty(draftModule.name) ||
      (isEmpty(draftModule.dimensions) && draftModule.type !== 'total') ||
      isEmpty(draftModule.metrics) ||
      isEmpty(draftModule.filters.id)

    return (
      <div>
        <form className='mdl-grid'>
          <div className={`mdl-cell mdl-cell--3-col ${style.leftCol}`}>
            <Lists />
          </div>
          <div className='mdl-cell mdl-cell--9-col'>
            <Tabs>
              <Tab id='module-content' title={messages.moduleContent}>
                <Preview />
              </Tab>
              <Tab id='module-size' title={messages.moduleSize}>
                <br/>
                <Size />
              </Tab>
              <Tab id='module-filters' title={messages.filterModuleResult}>
                <Filters />
              </Tab>
            </Tabs>
          </div>
        </form>

        <a className='mdl-button' onClick={this.cancel}>
          <Message>cancel</Message>
        </a>

        <button disabled={isInvalidModule} type='button' className='mdl-button' onClick={this.save}>
          <Message>save</Message>
        </button>

        <span className={`${style.rightButtons}`}>
          {isInvalidModule ? (
            <em className='mdl-color-text--red-A700'>
              <Message entity={draftEntity.name}>invalidModuleConfig</Message>
            </em>
          ) : (
            <button disabled={this.context.module.isLoading} type='button' className='mdl-button' onClick={this.reload}>
              <Message>update</Message>
            </button>
          )}

          <DateRangeButton className='mdl-button'/>
        </span>
      </div>
    )
  }
})

export default ModuleEdit
