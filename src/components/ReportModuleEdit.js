import React from 'react'
import {branch} from 'baobab-react/higher-order'
import pick from 'lodash/pick'
import Input from './Input'
import assign from 'lodash/assign'
import Message from '@tetris/front-server/lib/components/intl/Message'
import reportParamsType from '../propTypes/report-params'
import reportModuleType from '../propTypes/report-module'
import reportEntityType from '../propTypes/report-entity'
import reportMetaDataType from '../propTypes/report-meta-data'
import ReportChart from './ReportModuleChart'
import isEmpty from 'lodash/isEmpty'
import find from 'lodash/find'
import TypeSelect from './ReportModuleEditTypeSelect'
import Lists from './ReportModuleEditLists'

const {PropTypes} = React
const editableFields = ['name', 'type', 'dimensions', 'filters', 'metrics']

const ModuleEdit = React.createClass({
  displayName: 'Edit-Module',
  propTypes: {
    reportParams: reportParamsType,
    module: reportModuleType,
    entity: reportEntityType,
    metaData: reportMetaDataType,
    cancel: PropTypes.func,
    save: PropTypes.func
  },
  getInitialState () {
    const state = pick(this.props.module, editableFields)

    if (isEmpty(state.dimensions) && this.props.entity.id === 'Campaign') {
      state.dimensions = ['id']
    }

    return state
  },
  getDefaultProps () {
    return {
      metaData: {
        attributes: {},
        metrics: [],
        dimensions: [],
        filters: []
      }
    }
  },
  onChangeInput ({target: {name, value}}) {
    const newState = {[name]: value}

    if (name === 'type' && value === 'pie') {
      const {dimensions, metrics} = this.state

      if (dimensions.length > 1) {
        newState.dimensions = [dimensions[0]]
      }

      if (metrics.length > 1) {
        newState.metrics = [metrics[0]]
      }
    }

    this.setState(newState)
  },
  handleSubmit (e) {
    e.preventDefault()
    this.props.save(pick(this.state, editableFields))
  },
  removeEntity (id) {
    this.setState({
      filters: assign({}, this.state.filters, {
        id: this.state.filters.id.filter(m => m !== id)
      })
    })
  },
  addEntity (id) {
    this.setState({
      filters: assign({}, this.state.filters, {
        id: this.state.filters.id.concat([id])
      })
    })
  },
  removeItem (id) {
    const attribute = find(this.props.metaData.attributes, {id})
    if (attribute.is_dimension) {
      this.setState({dimensions: this.state.dimensions.filter(i => i !== id)})
    }

    if (attribute.is_metric) {
      this.setState({metrics: this.state.metrics.filter(i => i !== id)})
    }
  },
  addItem (id) {
    const {type} = this.state
    const attribute = find(this.props.metaData.attributes, {id})
    const add = type === 'pie'
      ? (ls, val) => [val]
      : (ls, val) => ls.concat([val])

    if (attribute.is_dimension) {
      this.setState({
        dimensions: add(this.state.dimensions, id)
      })
    }

    if (attribute.is_metric) {
      this.setState({
        metrics: add(this.state.metrics, id)
      })
    }
  },
  render () {
    const {metaData, entity, module, reportParams} = this.props
    const {name, type, filters, metrics, dimensions} = this.state
    const canSave = !isEmpty(metrics)
    const updatedModule = assign({}, module, pick(this.state, editableFields))

    return (
      <form onSubmit={this.handleSubmit}>
        <div className='mdl-grid'>
          <div className='mdl-cell mdl-cell--4-col' style={{height: 500, overflowY: 'auto'}}>

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

          <div className='mdl-cell mdl-cell--8-col' style={{height: 500, overflowY: 'auto'}}>
            <div className='mdl-grid'>
              <div className='mdl-cell mdl-cell--7-col'>
                <Input
                  name='name'
                  label='name'
                  value={name}
                  onChange={this.onChangeInput}/>
              </div>
              <div className='mdl-cell mdl-cell--5-col'>
                <TypeSelect onChange={this.onChangeInput} value={type}/>
              </div>
            </div>

            <ReportChart
              module={updatedModule}
              entity={entity}
              reportParams={reportParams}/>
          </div>
        </div>

        <a className='mdl-button' onClick={this.props.cancel}>
          <Message>cancel</Message>
        </a>

        <button className='mdl-button' disabled={!canSave}>
          <Message>save</Message>
        </button>
      </form>
    )
  }
})

export default branch(({entity, reportParams}) => ({
  metaData: ['reports', 'metaData', reportParams.platform, entity.id]
}), ModuleEdit)
