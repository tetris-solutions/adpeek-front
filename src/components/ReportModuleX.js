import assign from 'lodash/assign'
import debounce from 'lodash/debounce'
import find from 'lodash/find'
import isEmpty from 'lodash/isEmpty'
import pick from 'lodash/pick'
import React from 'react'
import moduleType from '../propTypes/report-module'
import reportEntityType from '../propTypes/report-entity'
import reportMetaDataType from '../propTypes/report-meta-data'
import reportParamsType from '../propTypes/report-params'
import Module from './ReportModule'
import {deleteModuleAction} from '../actions/delete-module'
import {loadReportModuleResultAction} from '../actions/load-report-module-result-x'
import {updateModuleAction} from '../actions/update-module'
import map from 'lodash/map'
import fPick from 'lodash/fp/pick'

const {PropTypes} = React

const ModuleController = React.createClass({
  displayName: 'Report-Module-Controller',
  propTypes: {
    module: moduleType.isRequired,
    editable: PropTypes.bool.isRequired,
    metaData: reportMetaDataType.isRequired,
    entity: reportEntityType.isRequired,
    entities: PropTypes.arrayOf(reportEntityType).isRequired,
    reportParams: reportParamsType
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
    const accounts = map(reportParams.accounts, fPick(['ad_account', 'tetris_account', 'platform']))

    return assign({filters, entity: entity.id},
      pick(module, 'dimensions', 'metrics'),
      pick(reportParams, 'from', 'to'),
      {accounts}
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
      <Module
        {...this.props}
        update={editable ? this.save : undefined}
        remove={editable ? this.remove : undefined}/>
    )
  }
})

function ReportModuleX (props) {
  const module = assign({}, props.module)
  const filters = assign({}, module.filters)
  const entity = find(props.entities, {id: module.entity})

  if (isEmpty(filters.id)) {
    filters.id = map(entity.list, 'id')
  }

  module.filters = filters

  return <ModuleController {...props} module={module} entity={entity}/>
}

ReportModuleX.displayName = 'Module-Wrapper'
ReportModuleX.propTypes = {
  module: moduleType,
  entities: PropTypes.arrayOf(reportEntityType).isRequired
}

export default ReportModuleX
