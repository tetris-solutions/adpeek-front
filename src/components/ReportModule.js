import csjs from 'csjs'
import isEmpty from 'lodash/isEmpty'
import React from 'react'

import reportEntityType from '../propTypes/report-entity'
import reportMetaDataType from '../propTypes/report-meta-data'
import reportModuleType from '../propTypes/report-module'
import reportParamsType from '../propTypes/report-params'
import Edit from './ReportModuleEdit'
import Modal from 'tetris-iso/Modal'
import ReportChart from './ReportModuleChart'
import {styled} from './mixins/styled'
import DeleteButton from './DeleteButton'

const style = csjs`
.card, .content, .content > div {
  width: 100%;
}`

const {PropTypes} = React

const ReportModule = React.createClass({
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
  contextTypes: {
    messages: PropTypes.object.isRequired
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
    const {messages} = this.context
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
            <button className='mdl-button mdl-button--icon' onClick={this.openModal}>
              <i className='material-icons'>create</i>
            </button>)}

          {remove && (
            <DeleteButton
              className='mdl-button mdl-button--icon'
              onClick={remove}
              entityName={module.name || messages.untitledModule}>
              <i className='material-icons'>clear</i>
            </DeleteButton>)}
        </div>

        {editMode && (
          <Modal size='huge'>
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

export default ReportModule
