import React from 'react'
import Input from './Input'
import assign from 'lodash/assign'
import Select from './Select'
import Message from '@tetris/front-server/lib/components/intl/Message'
import reportParamsType from '../propTypes/report-params'
import reportModuleType from '../propTypes/report-module'
import reportEntityType from '../propTypes/report-entity'
import reportMetaDataType from '../propTypes/report-meta-data'
import _ReportChart from './ReportModuleChart'
import find from 'lodash/find'
import TypeSelect from './ReportModuleEditTypeSelect'
import Lists from './ReportModuleEditLists'
import includes from 'lodash/includes'
import map from 'lodash/map'
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
  onChangeInput ({target: {name, value}}) {
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

    this.props.save(newState)
  },
  removeEntity (id) {
    this.props.save({
      filters: assign({}, this.props.module.filters, {
        id: this.props.module.filters.id.filter(m => m !== id)
      })
    })
  },
  addEntity (id) {
    this.props.save({
      filters: assign({}, this.props.module.filters, {
        id: this.props.module.filters.id.concat([id])
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
    const {name, type, filters, metrics, dimensions} = module

    return (
      <form>
        <div className='mdl-grid'>
          <div className='mdl-cell mdl-cell--3-col' style={{height: '80vh', overflowY: 'auto'}}>
            <Lists
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
              <div className='mdl-cell mdl-cell--5-col'>
                <Input name='name' label='name' defaultValue={name} onChange={this.onChangeInput}/>
              </div>
              <div className='mdl-cell mdl-cell--4-col'>
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
      </form>
    )
  }
})

export default ModuleEdit
