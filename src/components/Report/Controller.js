import get from 'lodash/get'
import isNumber from 'lodash/isNumber'
import map from 'lodash/map'
import max from 'lodash/max'
import sortBy from 'lodash/sortBy'
import Message from 'tetris-iso/Message'
import React from 'react'
import SubHeader from '../SubHeader'
import ReportExportButton from './ExportButton'
import entityType from '../../propTypes/report-entity'
import reportType from '../../propTypes/report'
import ReportModuleContainer from '../ReportModuleContainer'
import ReportDateRange from './DateRangeButton'
import {createModuleReportAction} from '../../actions/create-module'
import {exportReportAction} from '../../actions/export-report'
import {serializeReportModules} from '../../functions/seralize-report-modules'
import Page from '../Page'
import assign from 'lodash/assign'

const {PropTypes} = React

const ReportController = React.createClass({
  displayName: 'Report-Controller',
  propTypes: {
    report: reportType.isRequired,
    editMode: PropTypes.bool.isRequired,
    metaData: PropTypes.object.isRequired,
    dispatch: PropTypes.func.isRequired,
    params: PropTypes.object.isRequired,
    accounts: PropTypes.arrayOf(PropTypes.shape({
      ad_account: PropTypes.string,
      plaftorm: PropTypes.string,
      tetris_account: PropTypes.string
    })),
    entities: PropTypes.arrayOf(entityType).isRequired
  },
  contextTypes: {
    router: PropTypes.object,
    messages: PropTypes.object,
    location: PropTypes.object,
    moment: PropTypes.func
  },
  getInitialState () {
    return {
      isCreatingReport: false
    }
  },
  componentDidMount () {
    this.ensureDateRange()
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

    function getModuleElement ({id, name}) {
      const el = grid.querySelector(`div[data-report-module="${id}"]`)

      return {id, el, name}
    }

    const modules = map(report.modules, getModuleElement)

    this.setState({isCreatingReport: true})

    serializeReportModules(modules, type === 'xls')
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
  render () {
    const {metaData, editMode, accounts, report: {modules}} = this.props
    const {isCreatingReport} = this.state
    const {moment} = this.context
    const {from, to} = this.getCurrentRange()
    const reportParams = {accounts, from, to}

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
            <button className='mdl-button mdl-color-text--grey-100' onClick={this.addNewModule}>
              <Message>newModule</Message>
            </button>)}

          <ReportExportButton
            create={this.downloadReport}
            isCreatingReport={isCreatingReport}/>
        </SubHeader>
        <Page>
          <div className='mdl-grid' ref='grid'>{map(sortBy(modules, 'index'), (module, index) =>
            <div data-report-module={module.id} key={module.id} className={`mdl-cell mdl-cell--${module.cols}-col`}>
              <ReportModuleContainer
                changeDateRange={this.onChangeRange}
                module={module}
                editable={editMode}
                metaData={get(metaData, module.entity)}
                reportParams={reportParams}
                entities={this.props.entities}/>
            </div>)}
          </div>
        </Page>
      </div>
    )
  }
})

export default ReportController