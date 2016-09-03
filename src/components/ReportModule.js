import csjs from 'csjs'
import isEmpty from 'lodash/isEmpty'
import React from 'react'

import reportEntityType from '../propTypes/report-entity'
import reportMetaDataType from '../propTypes/report-meta-data'
import reportModuleType from '../propTypes/report-module'
import reportParamsType from '../propTypes/report-params'
import Edit from './ReportModuleEdit'
import Modal from './Modal'
import ReportChart from './ReportModuleChart'
import {styled} from './mixins/styled'

const style = csjs`
.card, .content, .content > div {
  width: 100%;
}`

const {PropTypes} = React
const editFormRequiredContext = ['tree', 'messages', 'locales', 'insertCss', 'params', 'moment']

const Module = React.createClass({
  displayName: 'Report-Module',
  mixins: [styled(style)],
  getInitialState () {
    return {
      editMode: (
        Boolean(this.props.update) &&
        isEmpty(this.props.module.metrics)
      )
    }
  },
  propTypes: {
    changeDateRange: PropTypes.func.isRequired,
    metaData: reportMetaDataType.isRequired,
    remove: PropTypes.func,
    update: PropTypes.func,
    module: reportModuleType,
    entity: reportEntityType,
    entities: PropTypes.arrayOf(reportEntityType),
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
    const {changeDateRange, module, entities, metaData, update, remove, entity, reportParams} = this.props

    return (
      <div className={`mdl-card mdl-shadow--2dp ${style.card}`}>
        <div ref='chartWrapper' className={`mdl-card__title mdl-card--expand ${style.content}`}>
          <ReportChart
            height={module.rows * 100}
            metaData={metaData}
            module={module}
            entity={entity}
            reportParams={reportParams}/>
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

        {editMode && (
          <Modal size='huge' provide={editFormRequiredContext} onEscPress={this.closeModal}>
            <Edit
              changeDateRange={changeDateRange}
              entities={entities}
              metaData={metaData}
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
