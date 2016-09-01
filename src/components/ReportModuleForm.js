import assign from 'lodash/assign'
import debounce from 'lodash/debounce'
import find from 'lodash/find'
import includes from 'lodash/includes'
import isArray from 'lodash/isArray'
import isEmpty from 'lodash/isEmpty'
import map from 'lodash/map'
import uniq from 'lodash/uniq'
import Message from '@tetris/front-server/lib/components/intl/Message'
import React from 'react'

import _ReportChart from './ReportModuleChart'
import reportEntityType from '../propTypes/report-entity'
import reportMetaDataType from '../propTypes/report-meta-data'
import reportModuleType from '../propTypes/report-module'
import reportParamsType from '../propTypes/report-params'
import Input from './Input'
import Lists from './ReportModuleEditLists'
import Select from './Select'
import TypeSelect from './ReportModuleEditTypeSelect'
import {expandVertically} from './higher-order/expand-vertically'

const {PropTypes} = React
const ReportChart = expandVertically(_ReportChart)

const ModuleEdit = React.createClass({
  displayName: 'Edit-Module',
  contextTypes: {
    messages: PropTypes.object,
    locales: PropTypes.string
  },
  propTypes: {
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
      this.props.save(assign({}, ...this.updateQueue))
      this.updateQueue = []
    }, 500)
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

    if (name === 'entity') {
      newState.dimensions = []
      newState.metrics = []
      newState.filters = {id: []}
    }

    if (name === 'type' && value === 'pie') {
      const {dimensions, metrics} = this.props.module

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

    this.props.save({
      filters: assign({}, this.props.module.filters, {
        id: this.props.module.filters.id.filter(currentId => !includes(ids, currentId))
      })
    })
  },
  addEntity (id) {
    const ids = isArray(id) ? id : [id]

    this.props.save({
      filters: assign({}, this.props.module.filters, {
        id: uniq(this.props.module.filters.id.concat(ids))
      })
    })
  },
  removeItem (attributeId) {
    const {attributes} = this.props.metaData
    const attribute = find(attributes, {id: attributeId})
    const goesWithoutId = id => !find(attributes, {id}).requires_id

    let {dimensions, metrics} = this.props.module

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

    this.props.save({metrics, dimensions})
  },
  addItem (id) {
    const {metaData: {attributes}} = this.props
    const {type} = this.props.module
    const getAttributeById = value => find(attributes, {id: value})
    const {requires, is_metric, is_dimension} = getAttributeById(id)
    const changes = {}

    function add (ls, val) {
      if (type === 'pie') {
        return [val]
      }

      if (requires) {
        return ls.concat(requires).concat([val])
      }

      return ls.concat([val])
    }

    if (is_dimension) {
      changes.dimensions = add(this.props.module.dimensions, id)
    }

    if (is_metric) {
      changes.metrics = add(this.props.module.metrics, id)
    }

    this.props.save(changes)
  },
  render () {
    const {metaData, entities, entity, module, reportParams} = this.props
    const {name, type, filters, limit, metrics, dimensions} = module

    return (
      <form>
        <div className='mdl-grid'>
          <div className='mdl-cell mdl-cell--3-col' style={{height: '80vh', overflowY: 'auto'}}>
            <Lists
              entities={entities}
              dimensions={dimensions}
              metrics={metrics}
              entity={entity}
              filters={filters}
              attributes={metaData.attributes}
              removeEntity={this.removeEntity}
              removeItem={this.removeItem}
              addEntity={this.addEntity}
              addItem={this.addItem}/>
          </div>
          <div className='mdl-cell mdl-cell--9-col' style={{height: '80vh', overflowY: 'auto'}}>
            <div className='mdl-grid'>
              <div className='mdl-cell mdl-cell--3-col'>
                <Input name='name' label='name' defaultValue={name} onChange={this.onChangeInput}/>
              </div>
              <div className='mdl-cell mdl-cell--3-col'>
                <Select label='entity' name='entity' onChange={this.onChangeInput} value={entity.id}>
                  {map(entities, ({id, name}) =>
                    <option key={id} value={id}>
                      {name}
                    </option>)}
                </Select>
              </div>
              <div className='mdl-cell mdl-cell--3-col'>
                <TypeSelect onChange={this.onChangeInput} value={type}/>
              </div>
              <div className='mdl-cell mdl-cell--3-col'>
                <Input type='number' name='limit' label='resultLimit' defaultValue={limit} onChange={this.onChangeInput}/>
              </div>
            </div>

            <ReportChart
              metaData={metaData}
              module={module}
              entity={entity}
              reportParams={reportParams}/>
          </div>
        </div>

        <a className='mdl-button' onClick={this.props.close}>
          <Message>close</Message>
        </a>

        {isEmpty(dimensions) || isEmpty(metrics) ? (
          <em className='mdl-color-text--red-600' style={{float: 'right', marginRight: '2em'}}>
            <Message>invalidModuleConfig</Message>
          </em>
        ) : null}
      </form>
    )
  }
})

export default ModuleEdit
