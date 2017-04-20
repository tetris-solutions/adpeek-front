import concat from 'lodash/concat'
import assign from 'lodash/assign'
import forEach from 'lodash/forEach'
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
import PropTypes from 'prop-types'
import reportEntityType from '../../../propTypes/report-entity'
import reportModuleType from '../../../propTypes/report-module'
import Editor from './Editor'
import Emmett from 'emmett'

const editableFields = ['description', 'name', 'type', 'dimensions', 'metrics', 'rows', 'cols', 'entity', 'limit', 'sort', 'filters']
const MAX_ACCOUNTS = 15
const MAX_GA_DIMENSIONS = 7
const MAX_GA_METRICS = 10

function requiredDimensions (entity) {
  switch (entity) {
    // case 'Location':
    //   return ['countrycriteriaid']
    default:
      return []
  }
}

function defaultFilters (entity) {
  switch (entity) {
    case 'Location':
      return {locationtype: ['equals', 'LOCATION_OF_PRESENCE', '']}
    default:
      return {}
  }
}

class ModuleEdit extends React.Component {
  static displayName = 'Editor-Controller'

  static contextTypes = {
    attributes: PropTypes.object.isRequired,
    messages: PropTypes.object.isRequired,
    locales: PropTypes.string.isRequired,
    moment: PropTypes.func.isRequired,
    module: PropTypes.object.isRequired,
    entities: PropTypes.object.isRequired,
    getUsedAccounts: PropTypes.func.isRequired,
    activeOnly: PropTypes.bool.isRequired,
    report: PropTypes.object
  }

  static propTypes = {
    loadEntity: PropTypes.func.isRequired,
    close: PropTypes.func,
    save: PropTypes.func
  }

  static childContextTypes = {
    draft: PropTypes.shape({
      module: reportModuleType,
      entity: reportEntityType
    }),
    addEntity: PropTypes.func,
    removeEntity: PropTypes.func,
    addAttribute: PropTypes.func,
    removeAttribute: PropTypes.func,
    change: PropTypes.func,
    onChangeName: PropTypes.func,
    onChangeEntity: PropTypes.func,
    onChangeType: PropTypes.func
  }

  constructor (props, context) {
    super(props, context)
    const snapshot = pick(context.module, editableFields)

    this.state = {
      oldModule: snapshot,
      newModule: snapshot
    }
  }

  getChildContext () {
    return {
      draft: {
        module: this.getDraftModule(),
        entity: this.getDraftEntity()
      },
      change: this.change,
      onChangeName: this.onChangeName,
      onChangeType: this.onChangeType,
      onChangeEntity: this.onChangeEntity,
      addAttribute: this.addAttribute,
      removeAttribute: this.removeAttribute,
      addEntity: this.addEntity,
      removeEntity: this.removeEntity
    }
  }

  componentWillMount () {
    this.updateQueue = []
    this.persist = debounce(this.flushUpdateQueue, 500)
  }

  componentDidMount () {
    this.$e = new Emmett()
  }

  componentDidUpdate () {
    this.$e.emit('update')
  }

  flushUpdateQueue = () => {
    this.change(assign({}, ...this.updateQueue), true)
    this.updateQueue = []
  }

  enqueueUpdate = (update) => {
    this.updateQueue.push(update)
    this.persist()
  }

  onChangeName = ({target: {value}}) => {
    this.enqueueUpdate({name: value})
  }

  onChangeType = ({target: {value}}) => {
    const newState = {type: value}

    if (value === 'pie' || value === 'total') {
      const {dimensions, metrics} = this.getDraftModule()

      if (dimensions.length > 1) {
        newState.dimensions = value === 'total' ? [] : [dimensions[0]]
      }

      if (metrics.length > 1) {
        newState.metrics = [metrics[0]]
      }
    }

    this.change(newState, true)
  }

  onChangeEntity = ({target: {value: entity}}) => {
    const base = {
      entity,
      dimensions: [],
      metrics: [],
      filters: {id: []}
    }

    this.change(base, true)

    const afterUpdate = () => {
      if (this.context.module.entity !== entity) return

      this.change({
        dimensions: requiredDimensions(entity),
        filters: assign({}, base.filters, defaultFilters(entity))
      }, true)

      this.$e.off('update', afterUpdate)
    }

    this.$e.on('update', afterUpdate)
    this.props.loadEntity(entity)
  }

  removeEntity = (id) => {
    const ids = isArray(id) ? id : [id]
    const module = this.getDraftModule()
    const filters = assign({}, module.filters, {
      id: module.filters.id.filter(currentId => !includes(ids, currentId))
    })
    this.change({filters})
  }

  addEntity = (id) => {
    const ids = isArray(id) ? id : [id]
    const module = this.getDraftModule()
    const filters = assign({}, module.filters, {
      id: uniq(module.filters.id.concat(ids))
    })
    this.change({filters})
  }

  removeAttribute = (_attribute_, forceRedraw = false) => {
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
  }

  addAttribute = (_attribute_) => {
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
  }

  change = (changes, forceRedraw = false) => {
    const newModule = assign({}, this.state.newModule, changes)
    const redrawIfNecessary = () => {
      if (forceRedraw || changes.sort) {
        this.redraw()
      }
    }

    this.setState({newModule}, redrawIfNecessary)
  }

  cancel = () => {
    this.props.save(this.state.oldModule)
    this.props.close()
  }

  save = () => {
    const {activeOnly} = this.context
    const draftModule = assign({}, this.state.newModule)
    const ids = map(this.getDraftEntity().list, 'id')
    const canSafelyAssumeFullSelection = (
      activeOnly &&
      isEmpty(diff(ids, draftModule.filters.id))
    )

    if (canSafelyAssumeFullSelection) {
      draftModule.filters = assign({}, draftModule.filters)
      draftModule.filters.id = []
    }

    this.props.save(draftModule, true)
    this.props.close()
  }

  redraw = () => {
    this.props.save(this.state.newModule)
  }

  getDraftModule = () => {
    return assign({}, this.context.module, this.state.newModule)
  }

  getDraftEntity = () => {
    return this.context.entities[this.state.newModule.entity]
  }

  getInvalidPermutation = (dimensions, metrics) => {
    const {attributes} = this.context
    const selected = concat(dimensions, metrics)
    const isSelected = id => includes(selected, id)
    let invalidPermutation

    function checkForConflict (id) {
      const currentAttribute = find(attributes, {id})
      const deniedAttributeId = find(currentAttribute.incompatible, isSelected)

      if (deniedAttributeId) {
        invalidPermutation = [currentAttribute, find(attributes, {id: deniedAttributeId})]

        return false
      }
    }

    forEach(selected, checkForConflict)

    return invalidPermutation
  }

  getAttributeSelectionLimit = (dimensions, metrics) => {
    let tooManyDimensions = null
    let tooManyMetrics = null

    if (this.context.report.platform === 'analytics') {
      if (dimensions.length > MAX_GA_DIMENSIONS) {
        tooManyDimensions = {limit: MAX_GA_DIMENSIONS, selected: dimensions.length}
      }
      if (metrics.length > MAX_GA_METRICS) {
        tooManyMetrics = {limit: MAX_GA_METRICS, selected: metrics.length}
      }
    }

    return {tooManyMetrics, tooManyDimensions}
  }

  render () {
    const {name, type, dimensions, metrics, filters} = this.getDraftModule()
    const numberOfSelectedAccounts = this.context.getUsedAccounts(filters.id).length

    const isInvalidModule = (
      isEmpty(name) ||
      isEmpty(metrics) ||
      isEmpty(filters.id) ||
      (type !== 'total' && isEmpty(dimensions))
    )

    const invalidPermutation = isInvalidModule ? undefined : this.getInvalidPermutation(dimensions, metrics)
    const limits = this.getAttributeSelectionLimit(dimensions, metrics)

    return (
      <Editor
        invalidPermutation={invalidPermutation}
        maxAccounts={MAX_ACCOUNTS}
        numberOfSelectedAccounts={numberOfSelectedAccounts}
        isInvalid={isInvalidModule}
        isLoading={Boolean(this.context.module.isLoading)}
        tooManyMetrics={limits.tooManyMetrics}
        tooManyDimensions={limits.tooManyDimensions}
        cancel={this.cancel}
        redraw={this.redraw}
        save={this.save}/>
    )
  }
}

export default ModuleEdit
