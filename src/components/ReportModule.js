import React from 'react'
import Edit from './ReportModuleEdit'
import Modal from './Modal'
import ReportChart from './ReportModuleChart'
import reportParamsType from '../propTypes/report-params'
import reportModuleType from '../propTypes/report-module'
import reportEntityType from '../propTypes/report-entity'
import csjs from 'csjs'
import {styled} from './mixins/styled'
import isEmpty from 'lodash/isEmpty'

const style = csjs`
.card, .content, .content > div {
  width: 100%;
}`

const {PropTypes} = React

const Module = React.createClass({
  displayName: 'Report-Module',
  mixins: [styled(style)],
  getInitialState () {
    return {
      editMode: isEmpty(this.props.module.metrics)
    }
  },
  propTypes: {
    remove: PropTypes.func,
    update: PropTypes.func,
    module: reportModuleType,
    entity: reportEntityType,
    reportParams: reportParamsType
  },
  componentWillReceiveProps ({module: {cols, rows}}) {
    const {module} = this.props

    this.repaintChart = cols !== module.cols || rows !== module.rows
  },
  componentDidUpdate () {
    const resizedChart = this.repaintChart
      ? this.refs.chartWrapper.querySelector('div[data-highcharts-chart]')
      : null

    if (resizedChart) {
      resizedChart.HCharts.reflow()
    }
  },
  openModal () {
    this.setState({editMode: true})
  },
  closeModal () {
    this.setState({editMode: false})
  },
  render () {
    const {editMode} = this.state
    const {module, update, remove, entity, reportParams} = this.props

    return (
      <div className={`mdl-card mdl-shadow--2dp ${style.card}`}>
        <div ref='chartWrapper' className={`mdl-card__title mdl-card--expand ${style.content}`}>
          <ReportChart module={module} entity={entity} reportParams={reportParams}/>
        </div>

        <div className='mdl-card__menu'>
          {update && (
            <button className='mdl-button mdl-button--icon mdl-js-button mdl-js-ripple-effect' onClick={this.openModal}>
              <i className='material-icons'>create</i>
            </button>)}

          {remove && (
            <button className='mdl-button mdl-button--icon mdl-js-button mdl-js-ripple-effect' onClick={remove}>
              <i className='material-icons'>clear</i>
            </button>)}
        </div>

        {editMode === true && (
          <Modal
            size='large'
            provide={['tree', 'messages', 'locales', 'insertCss']}
            onEscPress={this.closeModal}>

            <Edit
              module={module}
              entity={entity}
              reportParams={reportParams}
              save={update}
              close={this.closeModal}/>

          </Modal>
        )}
      </div>
    )
  }
})

export default Module
