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
import reportEntityType from '../propTypes/report-entity'
import reportMetaDataType from '../propTypes/report-meta-data'
import reportModuleType from '../propTypes/report-module'
import reportParamsType from '../propTypes/report-params'
import ReportModuleEditPreview from './ReportModuleEditPreview'
import ReportModuleEditFilters from './ReportModuleEditFilters'
import Lists from './ReportModuleEditLists'
import ReportDateRange from './ReportDateRange'
import Sizing from './ReportModuleSizing'
import {Tabs, Tab} from './Tabs'

const {PropTypes} = React

const editableFields = ['name', 'type', 'dimensions', 'metrics', 'rows', 'cols', 'entity', 'limit', 'sort', 'filters']

const ModuleEdit = React.createClass({
  displayName: 'Edit-Module',
  contextTypes: {
    messages: PropTypes.object,
    locales: PropTypes.string,
    moment: PropTypes.func
  },
  propTypes: {
    changeDateRange: PropTypes.func.isRequired,
    dispatch: PropTypes.func,
    reportParams: reportParamsType,
    module: reportModuleType,
    entities: PropTypes.arrayOf(reportEntityType),
    entity: reportEntityType,
    metaData: reportMetaDataType,
    close: PropTypes.func,
    save: PropTypes.func
  },
  getInitialState () {
    const snapshot = pick(this.props.module, editableFields)

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
  onChangeInput ({target: {type, name, value}}) {
    if (type === 'number') {
      value = isNaN(Number(value)) ? 0 : Number(value)
    }

    const newState = {[name]: value}
    const module = this.getModule()

    if (name === 'entity') {
      newState.dimensions = []
      newState.metrics = []
      newState.filters = {id: []}
    }

    if (name === 'type' && value === 'pie') {
      const {dimensions, metrics} = module

      if (dimensions.length > 1) {
        newState.dimensions = [dimensions[0]]
      }

      if (metrics.length > 1) {
        newState.metrics = [metrics[0]]
      }
    }

    this.enqueueUpdate(newState)
  },
  removeEntity (id) {
    const ids = isArray(id) ? id : [id]
    const module = this.getModule()

    this.update({
      filters: assign({}, module.filters, {
        id: module.filters.id.filter(currentId => !includes(ids, currentId))
      })
    })
  },
  addEntity (id) {
    const ids = isArray(id) ? id : [id]
    const module = this.getModule()
    const filters = assign({}, module.filters, {
      id: uniq(module.filters.id.concat(ids))
    })
    this.update({filters})
  },
  removeItem (_attribute_, forceReload = false) {
    const {attributes} = this.props.metaData
    const removedAttributesIds = isArray(_attribute_) ? _attribute_ : [_attribute_]
    const module = this.getModule()
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
  addItem (_attribute_) {
    const {metaData: {attributes}} = this.props
    const selectedAttributeIds = isArray(_attribute_) ? _attribute_ : [_attribute_]
    const module = this.getModule()
    const getAttributeById = value => find(attributes, {id: value})
    const changes = {
      dimensions: module.dimensions.concat(),
      metrics: module.metrics.concat()
    }

    function add (attribute, ls) {
      if (module.type === 'pie') {
        return [attribute.id]
      }

      if (attribute.requires) {
        return ls.concat(attribute.requires).concat([attribute.id])
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
    const ids = map(this.getEntity().list, 'id')
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
  getModule () {
    return assign({}, this.props.module, this.state.newModule)
  },
  getEntity () {
    return find(this.props.entities, {id: this.state.newModule.entity})
  },
  render () {
    const draftModule = this.getModule()
    const draftEntity = this.getEntity()
    const savedModule = this.props.module
    const savedEntity = this.props.entity
    const {changeDateRange, metaData, entities, reportParams} = this.props
    const {moment, messages} = this.context
    const isInvalidModule = isEmpty(draftModule.dimensions) ||
      isEmpty(draftModule.metrics) ||
      isEmpty(draftModule.filters.id)

    const previewProps = {metaData, savedModule, savedEntity, draftModule, draftEntity, reportParams, entities}

    return (
      <form>
        <div className='mdl-grid'>
          <div className='mdl-cell mdl-cell--3-col' style={{height: 'calc(80vh + 40px)', overflowY: 'auto'}}>
            <Lists
              {...draftModule}
              entity={draftEntity}
              entities={entities}
              attributes={metaData.attributes}
              removeEntity={this.removeEntity}
              removeItem={this.removeItem}
              addEntity={this.addEntity}
              addItem={this.addItem}/>
          </div>
          <div className='mdl-cell mdl-cell--9-col'>
            <Tabs>
              <Tab id='module-content' title={messages.moduleContent}>
                <ReportModuleEditPreview
                  update={this.update}
                  removeItem={this.removeItem}
                  onChangeInput={this.onChangeInput}
                  {...previewProps}/>
              </Tab>
              <Tab id='module-size' title={messages.moduleSize}>
                <br/>
                <Sizing module={draftModule} save={this.update}/>
              </Tab>
              <Tab id='module-filters' title={messages.filterModuleResult}>
                <ReportModuleEditFilters
                  filters={draftModule.filters}
                  limit={draftModule.limit}
                  dimensions={draftModule.dimensions}
                  metrics={draftModule.metrics}
                  attributes={metaData.attributes}
                  update={this.update}/>
              </Tab>
            </Tabs>
          </div>
        </div>

        <a className='mdl-button' onClick={this.cancel}>
          <Message>cancel</Message>
        </a>

        <button disabled={isInvalidModule} type='button' className='mdl-button' onClick={this.save}>
          <Message>save</Message>
        </button>

        <span style={{float: 'right', marginRight: '1em'}}>
          {isInvalidModule ? (
            <em className='mdl-color-text--red-A700'>
              <Message entity={draftEntity.name}>invalidModuleConfig</Message>
            </em>
          ) : (
            <button disabled={savedModule.isLoading} type='button' className='mdl-button' onClick={this.reload}>
              <Message>update</Message>
            </button>)}

          <ReportDateRange
            buttonClassName='mdl-button'
            onChange={changeDateRange}
            startDate={moment(reportParams.from)}
            endDate={moment(reportParams.to)}/>
        </span>
      </form>
    )
  }
})

export default ModuleEdit
