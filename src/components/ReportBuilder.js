import React from 'react'
import Message from '@tetris/front-server/lib/components/intl/Message'
import moment from 'moment'
import ReportDateRange from './ReportDateRange'
import map from 'lodash/map'
import Module from './ReportModuleController'
import assign from 'lodash/assign'
import size from 'lodash/size'
import {contextualize} from './higher-order/contextualize'
import {createModuleReportAction} from '../actions/create-module'
import reportType from '../propTypes/report'
import sortBy from 'lodash/sortBy'

const {PropTypes} = React

const ReportBuilder = React.createClass({
  displayName: 'Report-Builder',
  propTypes: {
    report: reportType,
    dispatch: PropTypes.func,
    params: PropTypes.object,
    reportParams: PropTypes.shape({
      ad_account: PropTypes.string,
      plaftorm: PropTypes.string,
      tetris_account: PropTypes.string
    }),
    entity: PropTypes.shape({
      id: PropTypes.string,
      name: PropTypes.string,
      list: PropTypes.array
    }).isRequired
  },
  contextTypes: {
    messages: PropTypes.object
  },
  getInitialState () {
    return {
      startDate: moment().startOf('week').subtract(7, 'days'),
      endDate: moment().startOf('week').subtract(1, 'days')
    }
  },
  getNewModule () {
    const {messages} = this.context
    const index = size(this.props.report.modules)

    return {
      type: 'line',
      name: messages.module + ' ' + (index + 1),
      index
    }
  },
  onChangeRange ({startDate, endDate}) {
    this.setState({startDate, endDate})
  },
  addNewModule () {
    const {report, params, dispatch} = this.props
    const {messages} = this.context
    const index = size(report.modules)

    dispatch(createModuleReportAction, params, {
      type: 'line',
      name: messages.module + ' ' + (index + 1),
      index
    })
  },
  render () {
    const {report: {modules, metaData}} = this.props
    const {startDate, endDate} = this.state
    const reportParams = assign({
      from: startDate.format('YYYY-MM-DD'),
      to: endDate.format('YYYY-MM-DD')
    }, this.props.reportParams)

    return (
      <div>
        <header className='mdl-layout__header'>
          <div className='mdl-layout__header-row mdl-color--blue-grey-500'>
            <ReportDateRange
              onChange={this.onChangeRange}
              startDate={startDate}
              endDate={endDate}/>

            <div className='mdl-layout-spacer'/>

            <button className='mdl-button mdl-color-text--grey-100' onClick={this.addNewModule}>
              <Message>newModule</Message>
            </button>
          </div>
        </header>
        <div className='mdl-grid'>
          {map(sortBy(modules, 'index'), module => (
            <div
              key={module.id}
              className={`mdl-cell mdl-cell--${module.cols}-col`}>

              <Module
                id={module.id}
                editable
                metaData={metaData}
                reportParams={reportParams}
                entity={this.props.entity}/>
            </div>
          ))}

        </div>
      </div>
    )
  }
})

export default contextualize(ReportBuilder, 'report')
