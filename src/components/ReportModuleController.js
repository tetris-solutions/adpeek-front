import React from 'react'
import reportParamsType from '../propTypes/report-params'
import reportEntityType from '../propTypes/report-entity'
import reportMetaDataType from '../propTypes/report-meta-data'
import isEmpty from 'lodash/isEmpty'
import {getDeepCursor} from '../functions/get-deep-cursor'
import debounce from 'lodash/debounce'
import {loadReportModuleResultAction} from '../actions/load-report-result'
import {deleteModuleAction} from '../actions/delete-module'
import pick from 'lodash/pick'
import assign from 'lodash/assign'
import Module from './ReportModule'
import {updateModuleAction} from '../actions/update-module'
import find from 'lodash/find'

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
    editable: PropTypes.bool,
    metaData: reportMetaDataType,
    id: PropTypes.string.isRequired,
    entities: PropTypes.arrayOf(reportEntityType).isRequired,
    reportParams: reportParamsType
  },
  contextTypes: {
    tree: PropTypes.object,
    params: PropTypes.object
  },
  componentWillMount () {
    const {tree, params} = this.context

    // @todo adapt for other report locations (e.g. workspace)

    this.cursor = tree.select(getDeepCursor(tree, [
      'user',
      ['companies', params.company],
      ['workspaces', params.workspace],
      ['folders', params.folder],
      ['reports', params.report],
      ['modules', this.props.id]
    ]))

    this.fetchResult = debounce(
      query => query && loadReportModuleResultAction(this.cursor, this.props.id, query),
      1000
    )

    const onUpdate = debounce(() => this.forceUpdate(), 300)

    this.cursor.on('update', onUpdate)
  },
  componentDidMount () {
    this.fetchResult(this.getChartQuery())
  },
  componentDidUpdate () {
    this.fetchResult(this.getChartQuery())
  },
  componentWillUnmount () {
    this.cursor.release()
    this.cursor = null
  },
  getEntity () {
    return find(this.props.entities, {id: this.cursor.get('entity')})
  },
  getChartQuery () {
    const {reportParams} = this.props
    const module = this.cursor.get()
    const entity = this.getEntity()

    if (!module) return

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
    deleteModuleAction(this.cursor)
  },
  save (updatedModule) {
    updateModuleAction(
      this.cursor,
      this.context.params.folder,
      assign({id: this.props.id}, updatedModule)
    )
  },
  render () {
    const {editable} = this.props
    const module = this.cursor.get()

    if (!module) return null

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
