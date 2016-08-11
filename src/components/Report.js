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
import {updateReportAction} from '../actions/update-report'
import reportType from '../propTypes/report'
import sortBy from 'lodash/sortBy'
import Input from './Input'
import debounce from 'lodash/debounce'
import toArray from 'lodash/toArray'

const {PropTypes} = React

const ReportBuilder = React.createClass({
  displayName: 'Report',
  propTypes: {
    report: reportType,
    editMode: PropTypes.bool.isRequired,
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
  componentWillMount () {
    const {dispatch, params, report: {id}} = this.props
    const getName = () => this.refs.header.querySelector('input[name="name"]').value

    this.onChangeName = debounce(() =>
      dispatch(updateReportAction, params, {id, name: getName()}), 1000)
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
  downloadReport () {
    /**
     * @type {HTMLDivElement}
     */
    const {URL} = window
    const gridDiv = this.refs.grid
    const modules = toArray(gridDiv.querySelectorAll('div[data-report-module]'))
    const createURL = URL.createObjectURL
    const exportedModules = []

    /**
     * capture chart image
     * @param {HTMLDivElement} moduleEl report module container
     * @returns {undefined}
     */
    function exportChart (moduleEl) {
      URL.createObjectURL = createURL

      const highChart = moduleEl.querySelector('div[data-highcharts-chart]')

      if (highChart) {
        URL.createObjectURL = (...args) => {
          const img = createURL.apply(URL, args)

          exportedModules.push({
            img,
            moduleEl
          })

          return img
        }

        highChart.HCharts.exportChartLocal()
      } else {
        /**
         *
         * @type {HTMLTableElement}
         */
        const table = moduleEl.querySelector('table')

        exportedModules.push({
          html: table.outerHTML,
          moduleEl
        })
      }
    }

    modules.forEach(exportChart)

    URL.createObjectURL = createURL

    // console.log(exportedModules)
  },
  render () {
    const {editMode, report: {name, modules, metaData}} = this.props
    const {startDate, endDate} = this.state
    const reportParams = assign({
      from: startDate.format('YYYY-MM-DD'),
      to: endDate.format('YYYY-MM-DD')
    }, this.props.reportParams)

    return (
      <div>
        <header className='mdl-layout__header'>
          <div ref='header' className='mdl-layout__header-row mdl-color--blue-grey-500'>
            {editMode
              ? <Input name='name' onChange={this.onChangeName} defaultValue={name}/>
              : name}

            <div className='mdl-layout-spacer'/>

            <ReportDateRange
              onChange={this.onChangeRange}
              startDate={startDate}
              endDate={endDate}/>

            <button className='mdl-button mdl-color-text--grey-100' onClick={this.downloadReport}>
              <Message>extractReport</Message>
            </button>

            {editMode && (
              <button className='mdl-button mdl-color-text--grey-100' onClick={this.addNewModule}>
                <Message>newModule</Message>
              </button>)}
          </div>
        </header>
        <div className='mdl-grid' ref='grid'>
          {map(sortBy(modules, 'index'), module => (
            <div
              data-report-module={module.id}
              key={module.id}
              className={`mdl-cell mdl-cell--${module.cols}-col`}>

              <Module
                id={module.id}
                editable={editMode}
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
