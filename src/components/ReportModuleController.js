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
import {loadReportModuleResultAction} from '../actions/load-report-result'
import {updateModuleAction} from '../actions/update-module'

const {PropTypes} = React

const ReportModule = React.createClass({
  displayName: 'Report-Module-Controller',
  getDefaultProps () {
    return {
      editable: false,
      metaData: {
        attributes: {},
        metrics: [],
        dimensions: [],
        filters: []
      }
    }
  },
  propTypes: {
    module: moduleType,
    editable: PropTypes.bool,
    metaData: reportMetaDataType,
    entity: reportEntityType,
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

    return assign({filters, entity: entity.id},
      pick(module, 'dimensions', 'metrics'),
      pick(reportParams, 'ad_account', 'tetris_account', 'platform', 'from', 'to')
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

function ModuleWrapper (props) {
  const module = assign({}, props.module)
  const filters = assign({}, module.filters)
  const entity = find(props.entities, {id: module.entity})

  if (isEmpty(filters.id)) {
    filters.id = entity.list.map(({id}) => id)
  }

  module.filters = filters

  return <ReportModule {...props} module={module} entity={entity}/>
}

ModuleWrapper.displayName = 'Module-Wrapper'
ModuleWrapper.propTypes = {
  module: moduleType,
  entities: PropTypes.arrayOf(reportEntityType).isRequired
}

export default ModuleWrapper
