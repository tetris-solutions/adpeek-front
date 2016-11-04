import assign from 'lodash/assign'
import debounce from 'lodash/debounce'
import pick from 'lodash/pick'
import React from 'react'
import moduleType from '../propTypes/report-module'
import reportEntityType from '../propTypes/report-entity'
import reportMetaDataType from '../propTypes/report-meta-data'
import reportParamsType from '../propTypes/report-params'
import ReportModule from './ReportModule'
import {deleteModuleAction} from '../actions/delete-module'
import {loadReportModuleResultAction} from '../actions/load-report-module-result'
import {updateModuleAction} from '../actions/update-module'

const {PropTypes} = React

const ReportModuleController = React.createClass({
  displayName: 'Report-Module-Controller',
  propTypes: {
    module: moduleType.isRequired,
    editable: PropTypes.bool.isRequired,
    metaData: reportMetaDataType.isRequired,
    entity: reportEntityType.isRequired,
    entities: PropTypes.arrayOf(reportEntityType).isRequired,
    reportParams: reportParamsType.isRequired
  },
  contextTypes: {
    tree: PropTypes.object,
    params: PropTypes.object
  },
  componentDidMount () {
    this.fetchResult = debounce(this.startResultLoadingAction, 1000)
    this.fetchResult(this.getChartQuery())
  },
  componentDidUpdate () {
    this.fetchResult(this.getChartQuery())
  },
  startResultLoadingAction (query) {
    if (!query) return

    loadReportModuleResultAction(
      this.context.tree,
      this.context.params,
      this.props.module.id,
      query,
      this.props.metaData.attributes)
  },
  getChartQuery () {
    const {reportParams} = this.props
    const {module, entity} = this.props
    const filters = assign({}, module.filters)

    return assign({filters, entity: entity.id},
      pick(module, 'dimensions', 'metrics'),
      pick(reportParams, 'from', 'to', 'accounts')
    )
  },
  remove () {
    deleteModuleAction(
      this.context.tree,
      this.context.params,
      this.props.module.id
    )
  },
  save (moduleChanges, persistChanges) {
    updateModuleAction(
      this.context.tree,
      this.context.params,
      this.props.module.id,
      moduleChanges,
      persistChanges
    )
  },
  render () {
    const {editable} = this.props

    return (
      <ReportModule
        {...this.props}
        update={editable ? this.save : undefined}
        remove={editable ? this.remove : undefined}/>
    )
  }
})

export default ReportModuleController
