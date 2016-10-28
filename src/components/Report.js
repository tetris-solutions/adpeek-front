import assign from 'lodash/assign'
import debounce from 'lodash/debounce'
import get from 'lodash/get'
import isNumber from 'lodash/isNumber'
import map from 'lodash/map'
import max from 'lodash/max'
import moment from 'moment'
import sortBy from 'lodash/sortBy'
import Message from 'tetris-iso/Message'
import React from 'react'
import SubHeader from './SubHeader'
import ReportExportButton from './ReportExportButton'
import entityType from '../propTypes/report-entity'
import reportType from '../propTypes/report'
import LoadingHorizontal from './LoadingHorizontal'
import Module from './ReportModuleController'
import ReportDateRange from './ReportDateRange'
import {createModuleReportAction} from '../actions/create-module'
import {exportReportAction} from '../actions/export-report'
import {updateReportAction} from '../actions/update-report'
import {serializeReportModules} from '../functions/seralize-report-modules'
import {contextualize} from './higher-order/contextualize'
import Page from './Page'

const {PropTypes} = React

const Report = React.createClass({
  displayName: 'Report',
  propTypes: {
    report: reportType,
    isLoading: PropTypes.bool.isRequired,
    editMode: PropTypes.bool.isRequired,
    metaData: PropTypes.object,
    dispatch: PropTypes.func,
    params: PropTypes.object,
    reportParams: PropTypes.shape({
      ad_account: PropTypes.string,
      plaftorm: PropTypes.string,
      tetris_account: PropTypes.string
    }),
    entities: PropTypes.arrayOf(entityType).isRequired
  },
  contextTypes: {
    router: PropTypes.object,
    messages: PropTypes.object,
    location: PropTypes.object
  },
  getInitialState () {
    return {
      isCreatingReport: false
    }
  },
  componentWillMount () {
    const {dispatch, params, report: {id}} = this.props
    const getName = () => this.refs.header.querySelector('input[name="name"]').value

    this.onChangeName = debounce(() =>
      dispatch(updateReportAction, params, {id, name: getName()}), 1000)
  },
  componentDidMount () {
    this.ensureRange()
  },
  componentWillReceiveProps (nextProps, nextContext) {
    this.ensureRange(nextContext)
  },
  ensureRange (context = this.context) {
    if (!context.location.query.from) {
      this.navigateToNewRange(this.getCurrentRange(), 'replace', context)
    }
  },
  getCurrentRange () {
    let {location: {query: {from, to}}} = this.context

    from = from || moment().subtract(30, 'days').format('YYYY-MM-DD')
    to = to || moment().format('YYYY-MM-DD')

    return {from, to}
  },
  onChangeRange ({startDate, endDate}) {
    this.navigateToNewRange({
      from: startDate.format('YYYY-MM-DD'),
      to: endDate.format('YYYY-MM-DD')
    })
  },
  navigateToNewRange ({from, to}, method = 'push', context = this.context) {
    const {location: {pathname}, router} = context

    router[method](`${pathname}?from=${from}&to=${to}`)
  },
  addNewModule () {
    const {report, params, dispatch} = this.props
    const {messages} = this.context
    const lastIndex = max(map(report.modules, 'index'))
    const index = (isNumber(lastIndex) ? lastIndex : -1) + 1

    dispatch(createModuleReportAction, params, {
      type: 'line',
      name: messages.module + ' ' + (index + 1),
      index
    })
  },
  downloadReport (type = 'pdf') {
    const {dispatch, params, report} = this.props
    const {grid} = this.refs

    function getModuleElement ({id, name}) {
      const el = grid.querySelector(`div[data-report-module="${id}"]`)

      return {id, el, name}
    }

    const modules = map(report.modules, getModuleElement)

    this.setState({isCreatingReport: true})

    serializeReportModules(modules, type === 'xls')
      .then(modules => dispatch(exportReportAction, params, type, {
        id: report.id,
        name: report.name,
        modules
      }))
      .then(response => this.setState({isCreatingReport: false},
        function navigateToReportUrl () {
          window.location.href = response.data.url
        }))
      .catch(() => this.setState({isCreatingReport: false}))
  },
  render () {
    const {isLoading, metaData, editMode, report: {modules}} = this.props
    const {isCreatingReport} = this.state
    const {from, to} = this.getCurrentRange()
    const reportParams = assign({from, to}, this.props.reportParams)
    const {platform} = reportParams

    // @todo bring back input for name editing

    return (
      <div>
        <SubHeader>
          <ReportDateRange
            buttonClassName='mdl-button mdl-color-text--grey-100'
            onChange={this.onChangeRange}
            startDate={moment(from)}
            endDate={moment(to)}/>

          {editMode && (
            <button disabled={isLoading} className='mdl-button mdl-color-text--grey-100' onClick={this.addNewModule}>
              <Message>newModule</Message>
            </button>)}

          <ReportExportButton
            create={this.downloadReport}
            isCreatingReport={isCreatingReport}
            isLoading={isLoading}/>
        </SubHeader>
        <Page>
          <div className='mdl-grid' ref='grid'>
            {isLoading ? (
              <LoadingHorizontal>
                <Message>loadingReport</Message>
              </LoadingHorizontal>
            ) : map(sortBy(modules, 'index'), (module, index) => (
              <div
                data-report-module={module.id}
                key={module.id}
                className={`mdl-cell mdl-cell--${module.cols}-col`}>

                <Module
                  changeDateRange={this.onChangeRange}
                  module={module}
                  editable={editMode}
                  metaData={get(metaData, [platform, module.entity])}
                  reportParams={reportParams}
                  entities={this.props.entities}/>
              </div>))}
          </div>
        </Page>
      </div>
    )
  }
})

export default contextualize(Report, 'report')
