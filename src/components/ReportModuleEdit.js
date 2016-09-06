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
import Message from '@tetris/front-server/lib/components/intl/Message'
import React from 'react'

import _ReportChart from './ReportModuleChart'
import reportEntityType from '../propTypes/report-entity'
import reportMetaDataType from '../propTypes/report-meta-data'
import reportModuleType from '../propTypes/report-module'
import reportParamsType from '../propTypes/report-params'
import Fields from './ReportModuleEditFields'
import Input from './Input'
import Lists from './ReportModuleEditLists'
import ReportDateRange from './ReportDateRange'
import Select from './Select'
import Sizing from './ReportModuleSizing'
import TypeSelect from './ReportModuleEditTypeSelect'
import {expandVertically} from './higher-order/expand-vertically'
import {Tabs, Tab} from './Tabs'

const {PropTypes} = React
const ReportChart = expandVertically(_ReportChart)
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
  componentWillMount () {
    this.updateQueue = []
    this.persist = debounce(() => {
      this.update(assign({}, ...this.updateQueue), true)
      this.updateQueue = []
    }, 500)
  },
  getInitialState () {
    const snapshot = pick(this.props.module, editableFields)

    return {
      oldModule: snapshot,
      newModule: snapshot
    }
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
  removeItem (attributeId, forceReload = false) {
    const {attributes} = this.props.metaData
    const attribute = find(attributes, {id: attributeId})
    const goesWithoutId = id => !find(attributes, {id}).requires_id

    let {dimensions, metrics} = this.getModule()

    function remove (ls, val) {
      const ids = [val]

      if (attribute.required_by) {
        ids.splice(ids.length, 0, ...attribute.required_by)
      }

      return ls.filter(id => !includes(ids, id))
    }

    if (attribute.is_dimension) {
      dimensions = remove(dimensions, attributeId)
    }

    if (attribute.is_metric) {
      metrics = remove(metrics, attributeId)
    }

    if (attributeId === 'id') {
      dimensions = dimensions.filter(goesWithoutId)
      metrics = metrics.filter(goesWithoutId)
    }

    this.update({metrics, dimensions}, forceReload)
  },
  addItem (id) {
    const {metaData: {attributes}} = this.props
    const module = this.getModule()
    const getAttributeById = value => find(attributes, {id: value})
    const {requires, is_metric, is_dimension} = getAttributeById(id)
    const changes = {}

    function add (ls, val) {
      if (module.type === 'pie') {
        return [val]
      }

      if (requires) {
        return ls.concat(requires).concat([val])
      }

      return ls.concat([val])
    }

    if (is_dimension) {
      changes.dimensions = add(module.dimensions, id)
    }

    if (is_metric) {
      changes.metrics = add(module.metrics, id)
    }

    this.update(changes)
  },
  update (changes, forceReload = false) {
    const newModule = assign({}, this.state.newModule, changes)

    this.setState({newModule}, () => {
      if (forceReload || changes.sort) {
        this.reload()
      }
    })
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
                <section style={{height: '80vh', overflowY: 'auto'}}>
                  <div className='mdl-grid'>
                    <div className='mdl-cell mdl-cell--4-col'>
                      <Input name='name' label='name' defaultValue={draftModule.name} onChange={this.onChangeInput}/>
                    </div>

                    <div className='mdl-cell mdl-cell--3-col'>
                      <Select label='entity' name='entity' onChange={this.onChangeInput} value={draftEntity.id}>
                        {map(entities, ({id, name}) =>
                          <option key={id} value={id}>
                            {name}
                          </option>)}
                      </Select>
                    </div>

                    <div className='mdl-cell mdl-cell--3-col'>
                      <TypeSelect onChange={this.onChangeInput} value={draftModule.type}/>
                    </div>

                    <div className='mdl-cell mdl-cell--2-col'>
                      <Input type='number' name='limit' label='resultLimit' defaultValue={draftModule.limit} onChange={this.onChangeInput}/>
                    </div>
                    <Fields
                      module={draftModule}
                      attributes={metaData.attributes}
                      save={this.update}
                      remove={this.removeItem}/>
                  </div>

                  <ReportChart
                    save={this.update}
                    metaData={metaData}
                    module={savedModule}
                    entity={savedEntity}
                    reportParams={reportParams}/>
                </section>
              </Tab>
              <Tab id='module-size' title={messages.moduleSize}>
                <br/>
                <Sizing module={draftModule} save={this.update} />
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
