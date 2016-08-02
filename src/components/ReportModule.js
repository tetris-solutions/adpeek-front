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

const ReportModule = React.createClass({
  displayName: 'Report-Module',
  mixins: [styled(style)],
  getDefaultProps () {
    return {
      editable: false
    }
  },
  getInitialState () {
    return {
      editMode: isEmpty(this.props.module.metrics)
    }
  },
  propTypes: {
    editable: PropTypes.bool,
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
  remove () {
    this.props.remove(this.props.module.id)
  },
  save (updatedModule, closeAfterSaving = false) {
    this.props.update(this.props.module.id, updatedModule)

    if (closeAfterSaving) {
      this.closeModal()
    }
  },
  render () {
    const {editMode} = this.state
    const {module, editable, entity, reportParams} = this.props

    return (
      <div className={`mdl-card mdl-shadow--2dp ${style.card}`}>
        <div ref='chartWrapper' className={`mdl-card__title mdl-card--expand ${style.content}`}>
          <ReportChart
            module={module}
            entity={entity}
            reportParams={reportParams}/>
        </div>

        {editable && (
          <div className='mdl-card__menu'>
            <button
              className='mdl-button mdl-button--icon mdl-js-button mdl-js-ripple-effect'
              onClick={this.openModal}>

              <i className='material-icons'>create</i>
            </button>
            <button
              className='mdl-button mdl-button--icon mdl-js-button mdl-js-ripple-effect'
              onClick={this.remove}>

              <i className='material-icons'>clear</i>
            </button>
          </div>
        )}

        {editable && editMode === true && (
          <Modal
            size='large'
            provide={['tree', 'messages', 'locales', 'insertCss']}
            onEscPress={this.closeModal}>

            <Edit
              module={module}
              entity={entity}
              reportParams={reportParams}
              save={this.save}
              close={this.closeModal}/>

          </Modal>
        )}
      </div>
    )
  }
})

export default ReportModule
