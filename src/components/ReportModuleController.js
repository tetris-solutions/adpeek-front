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
    entities: PropTypes.arrayOf(reportEntityType).isRequired,
    reportParams: reportParamsType
  },
  contextTypes: {
    tree: PropTypes.object,
    params: PropTypes.object
  },
  componentDidMount () {
    this.fetchResult = debounce(query =>
      query && loadReportModuleResultAction(
        this.context.tree,
        this.context.params,
        this.props.module.id,
        query), 1000)

    this.fetchResult(this.getChartQuery())
  },
  componentDidUpdate () {
    this.fetchResult(this.getChartQuery())
  },
  getEntity () {
    return find(this.props.entities, {id: this.props.module.entity})
  },
  getChartQuery () {
    const {reportParams} = this.props
    const {module} = this.props
    const entity = this.getEntity()
    const filters = assign({}, module.filters)

    if (isEmpty(filters.id)) {
      filters.id = entity.list.map(({id}) => id)
    }

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
  save (moduleChanges) {
    updateModuleAction(
      this.context.tree,
      this.context.params,
      this.props.module.id,
      moduleChanges
    )
  },
  render () {
    const {editable, module} = this.props

    return (
      <Module
        {...this.props}
        entity={this.getEntity()}
        update={editable ? this.save : undefined}
        remove={editable ? this.remove : undefined}
        module={module}/>
    )
  }
})

export default ReportModule
