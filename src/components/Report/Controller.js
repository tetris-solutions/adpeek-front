import get from 'lodash/get'
import isNumber from 'lodash/isNumber'
import assign from 'lodash/assign'
import map from 'lodash/map'
import max from 'lodash/max'
import uniqBy from 'lodash/uniqBy'
import sortBy from 'lodash/sortBy'
import React from 'react'
import entityType from '../../propTypes/report-entity'
import reportType from '../../propTypes/report'
import reportParamsType from '../../propTypes/report-params'
import Module from './Module/Container'
import {createModuleReportAction} from '../../actions/create-module'
import {exportReportAction} from '../../actions/export-report'
import {serializeReportModules} from '../../functions/seralize-report-modules'
import {loadReportAction} from '../../actions/load-report'
import {setDefaultReportAction} from '../../actions/set-default-report'

import ReportScreen from './Screen'
const getAccountKey = ({tetris_account, ad_account}) => `${tetris_account}:${ad_account}`
const insertId = a => assign({}, a, {id: getAccountKey(a)})

const ReportController = React.createClass({
  displayName: 'Report-Controller',
  propTypes: {
    children: React.PropTypes.node,
    reportLiteMode: React.PropTypes.bool,
    editMode: React.PropTypes.bool,
    report: reportType.isRequired,
    metaData: React.PropTypes.object.isRequired,
    dispatch: React.PropTypes.func.isRequired,
    params: React.PropTypes.object.isRequired,
    accounts: React.PropTypes.arrayOf(React.PropTypes.shape({
      ad_account: React.PropTypes.string,
      plaftorm: React.PropTypes.string,
      tetris_account: React.PropTypes.string
    })),
    entities: React.PropTypes.arrayOf(entityType).isRequired
  },
  contextTypes: {
    router: React.PropTypes.object,
    messages: React.PropTypes.object,
    location: React.PropTypes.object,
    moment: React.PropTypes.func
  },
  childContextTypes: {
    report: React.PropTypes.object,
    reportEntities: React.PropTypes.array,
    changeDateRange: React.PropTypes.func,
    reportParams: reportParamsType
  },
  getChildContext () {
    return {
      report: this.props.report,
      reportParams: this.getReportParams(),
      reportEntities: this.props.entities,
      changeDateRange: this.onChangeRange
    }
  },
  getInitialState () {
    return {
      isCreatingReport: false
    }
  },
  componentDidMount () {
    this.ensureDateRange()

    window.event$.on('report.onNewModuleClick', this.addNewModule)
  },
  componentWillUnmount () {
    window.event$.off('report.onNewModuleClick', this.addNewModule)
  },
  componentWillReceiveProps (nextProps, nextContext) {
    this.ensureDateRange(nextContext)
  },
  ensureDateRange (context = this.context) {
    if (!context.location.query.from) {
      this.navigateToNewRange(this.getCurrentRange(), 'replace', context)
    }
  },
  getCurrentRange () {
    let {location: {query: {from, to}}} = this.context
    const {moment} = this.context

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
      index,
      entity: 'Campaign',
      filters: {
        id: [],
        impressions: ['greater than', 1]
      }
    })
  },
  downloadReport (type, config) {
    const {dispatch, params, report} = this.props
    const {grid} = this.refs

    function getModuleElement ({id, name, comments}) {
      const el = grid.querySelector(`div[data-module-id="${id}"]`)

      return {id, el, name, comments}
    }

    const modules = map(report.modules, getModuleElement)

    this.setState({isCreatingReport: true})

    serializeReportModules(modules, type)
      .then(modules => dispatch(exportReportAction, params, type, assign({
        id: report.id,
        name: report.name,
        modules
      }, config)))
      .then(response => this.setState({isCreatingReport: false},
        function navigateToReportUrl () {
          window.location.href = response.data.url
        }))
      .catch(() => this.setState({isCreatingReport: false}))
  },
  reloadReport () {
    const {params, dispatch, report} = this.props

    return dispatch(loadReportAction, params, report.id)
  },
  favoriteReport () {
    const {params, dispatch, report} = this.props

    return dispatch(setDefaultReportAction, params, report.id, true)
      .then(this.reloadReport)
  },
  getReportParams () {
    const {from, to} = this.getCurrentRange()
    const accounts = uniqBy(map(this.props.accounts, insertId), 'id')

    return {accounts, from, to}
  },
  render () {
    const {params, dispatch, children, reportLiteMode, editMode, metaData, report} = this.props
    const {isCreatingReport} = this.state

    return (
      <ReportScreen
        report={report}
        reportLiteMode={reportLiteMode}
        favoriteReport={this.favoriteReport}
        downloadReport={this.downloadReport}
        isCreatingReport={isCreatingReport}
        shareUrl={report.shareUrl}>

        <div className='mdl-grid' ref='grid'>{map(sortBy(report.modules, 'index'), (module, index) =>
          <div
            key={module.id}
            data-module-id={module.id}
            data-module-type={module.type}
            className={`mdl-cell mdl-cell--${module.cols}-col`}>

            <Module
              params={params}
              dispatch={dispatch}
              module={module}
              editable={editMode}
              metaData={get(metaData, module.entity)}/>
          </div>)}
        </div>

        {children || null}
      </ReportScreen>
    )
  }
})

export default ReportController
