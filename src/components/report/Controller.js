import React from 'react'
import PropTypes from 'prop-types'
import ReactDOM from 'react-dom'
import constant from 'lodash/constant'
import isEqual from 'lodash/isEqual'
import isEmpty from 'lodash/isEmpty'
import isNumber from 'lodash/isNumber'
import assign from 'lodash/assign'
import map from 'lodash/map'
import pick from 'lodash/pick'
import size from 'lodash/size'
import max from 'lodash/max'
import uniqBy from 'lodash/uniqBy'
import entityType from '../../propTypes/report-entity'
import reportType from '../../propTypes/report'
import reportParamsType from '../../propTypes/report-params'
import {createModuleReportAction} from '../../actions/create-module'
import {exportReportAction} from '../../actions/export-report'
import {serializeReportModules} from '../../functions/seralize-report-modules'
import {loadReportAction} from '../../actions/load-report'
import {setDefaultReportAction} from '../../actions/set-default-report'
import {updateReportLayoutAction} from '../../actions/update-report-layout'
import {cloneModuleAction} from '../../actions/clone-module'
import ReportScreen from './Screen'
import ReportGrid from './Grid'
import qs from 'query-string'
import {notNullable} from '../higher-order/not-nullable'

const getAccountKey = ({tetris_account, ad_account}) => `${tetris_account}:${ad_account}`
const insertId = a => assign({}, a, {id: getAccountKey(a)})
const cleanLayout = l => pick(l, 'i', 'x', 'y', 'w', 'h', 'static')

class ReportController extends React.Component {
  static displayName = 'Report-Controller'

  static propTypes = {
    loadEntity: PropTypes.func.isRequired,
    reportLiteMode: PropTypes.bool,
    editMode: PropTypes.bool,
    report: reportType.isRequired,
    metaData: PropTypes.object.isRequired,
    dispatch: PropTypes.func.isRequired,
    params: PropTypes.object.isRequired,
    accounts: PropTypes.arrayOf(PropTypes.shape({
      ad_account: PropTypes.string,
      plaftorm: PropTypes.string,
      tetris_account: PropTypes.string
    })),
    entities: PropTypes.arrayOf(entityType).isRequired
  }

  static contextTypes = {
    router: PropTypes.object,
    messages: PropTypes.object,
    location: PropTypes.object,
    moment: PropTypes.func
  }

  static childContextTypes = {
    accounts: PropTypes.array,
    report: PropTypes.object,
    changeDateRange: PropTypes.func,
    reportParams: reportParamsType
  }

  getChildContext () {
    return {
      accounts: this.props.accounts,
      report: this.props.report,
      reportParams: this.getReportParams(),
      changeDateRange: this.onChangeRange
    }
  }

  componentDidMount () {
    this.ensureDateRange()
    const hasNewModuleFlag = this.context.location.query.new

    if (hasNewModuleFlag && isEmpty(this.props.report.modules)) {
      this.addNewModule()
    }

    window.event$.on('report.onNewModuleClick', this.addNewModule)
  }

  componentWillUnmount () {
    this.dead = true
    window.event$.off('report.onNewModuleClick', this.addNewModule)
  }

  componentWillReceiveProps (nextProps, nextContext) {
    this.ensureDateRange(nextContext)

    const layout = this.calculateLayout(null, nextProps)

    if (layout !== this.state.layout) {
      this.setState({layout})
    }
  }

  ensureDateRange = (context = this.context) => {
    const {from, to} = context.location.query
    if (!from || !to) {
      this.navigateToNewRange(this.getCurrentRange(), 'replace', context)
    }
  }

  getCurrentRange = () => {
    let {location: {query: {from, to}}} = this.context
    const {moment} = this.context

    to = to || moment().subtract(1, 'day').format('YYYY-MM-DD')
    from = from || moment(to).subtract(29, 'days').format('YYYY-MM-DD')

    return {from, to}
  }

  onChangeRange = ({startDate, endDate}) => {
    this.navigateToNewRange({
      from: startDate.format('YYYY-MM-DD'),
      to: endDate.format('YYYY-MM-DD')
    })
  }

  navigateToNewRange = ({from, to}, method = 'push', context = this.context) => {
    const {location: {pathname, query}, router} = context

    const newQuery = assign({}, query, {
      from,
      to
    })

    router[method](`${pathname}?${qs.stringify(newQuery)}`)
  }

  addNewModule = () => {
    const {report, params, dispatch, loadEntity} = this.props
    const {messages: {module: defaultModuleName}} = this.context
    const lastY = max(map(report.modules, 'y'))
    const y = isNumber(lastY) ? lastY + 1 : 0
    const moduleCount = size(report.modules)

    const newModule = {
      type: 'table',
      name: defaultModuleName + ' ' + moduleCount,
      x: 0,
      y,
      entity: 'Campaign',
      filters: {id: []}
    }

    if (report.level === 'folder' && report.platform !== 'analytics') {
      newModule.filters.impressions = ['greater than', 1]
    }

    loadEntity(newModule.entity)

    dispatch(createModuleReportAction, params, newModule)
  }

  cloneModule = (id, name) => {
    const {params, dispatch, report} = this.props
    const lastY = max(map(report.modules, 'y'))
    const y = (isNumber(lastY) ? lastY : -1) + 1

    const newModule = {
      name,
      y,
      x: 0
    }

    return dispatch(cloneModuleAction, params, id, newModule)
      .then(response => this.openModuleEditor(response.data.id))
  }

  downloadReport = (type, config) => {
    const {dispatch, params, report} = this.props
    const container = ReactDOM.findDOMNode(this)

    function getModuleElement ({id, name, comments, description}) {
      const el = container.querySelector(`div[data-module-id="${id}"]`)

      return {id, el, name, comments, description}
    }

    const modules = map(report.modules, getModuleElement)

    this.setState({isCreatingReport: true})

    serializeReportModules(modules, type)
      .then(modules => dispatch(exportReportAction, params, type, assign({
        id: report.id,
        name: report.name,
        description: report.description,
        modules
      }, config)))
      .then(response => this.setState({isCreatingReport: false},
        function navigateToReportUrl () {
          window.location.href = response.data.url
        }))
      .catch(() => this.setState({isCreatingReport: false}))
  }

  reloadReport = () => {
    const {params, dispatch, report} = this.props

    return dispatch(loadReportAction, params, report.id)
  }

  favoriteReport = () => {
    const {params, dispatch, report} = this.props

    return dispatch(setDefaultReportAction, params, report.id, true)
      .then(this.reloadReport)
  }

  getReportParams = () => {
    const range = this.getCurrentRange()
    const anyChange = !this._reportParams || (
      this._reportParams.from !== range.from ||
      this._reportParams.to !== range.to
    )

    if (anyChange) {
      const accounts = uniqBy(map(this.props.accounts, insertId), 'id')
      this._reportParams = {accounts, from: range.from, to: range.to}
    }

    return this._reportParams
  }

  openModuleEditor = (id) => {
    this.setState({
      openModule: id
    })
  }

  calculateLayout = (layout = null, props = this.props) => {
    const {report, editMode} = props

    if (layout) {
      layout = map(layout, m => assign(cleanLayout(m), {static: !editMode}))
    } else {
      layout = map(report.modules, ({id: i, x, y, rows: h, cols: w}) => ({
        i,
        x,
        y,
        w,
        h,
        static: !editMode
      }))
    }

    return this.state && isEqual(this.state.layout, layout)
      ? this.state.layout
      : layout
  }

  onLayoutChange = (layout) => {
    if (this.dead) return

    const {params, dispatch} = this.props

    layout = this.calculateLayout(layout)

    if (layout !== this.state.layout) {
      this.setState({layout}, () => {
        dispatch(updateReportLayoutAction, params, layout)
      })
    }
  }

  state = {
    isCreatingReport: false,
    layout: this.calculateLayout()
  }

  render () {
    const {params, dispatch, entities, loadEntity, reportLiteMode, editMode, metaData, report} = this.props
    const {isCreatingReport, openModule, layout} = this.state

    return (
      <ReportScreen
        report={report}
        reportLiteMode={reportLiteMode}
        favoriteReport={this.favoriteReport}
        downloadReport={this.downloadReport}
        isCreatingReport={isCreatingReport}
        shareUrl={report.shareUrl}>

        <ReportGrid
          modules={report.modules}
          openModule={openModule}
          cloneModule={this.cloneModule}
          onLayoutChange={this.onLayoutChange}
          entities={entities}
          loadEntity={loadEntity}
          editMode={editMode}
          layout={layout}
          params={params}
          dispatch={dispatch}
          metaData={metaData}/>

      </ReportScreen>
    )
  }
}

export default notNullable(ReportController, constant(null), 'report')
