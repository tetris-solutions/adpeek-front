import React from 'react'
import reportParamsType from '../propTypes/report-params'
import reportEntityType from '../propTypes/report-entity'
import isEmpty from 'lodash/isEmpty'
import {getDeepCursor} from '../functions/get-deep-cursor'
import debounce from 'lodash/debounce'
import {loadReportModuleResultAction} from '../actions/load-report-result'
import {isvalidReportQuery} from '../functions/is-valid-report-query'
import pick from 'lodash/pick'
import assign from 'lodash/assign'
import Module from './ReportModule'

const {PropTypes} = React

const ReportModule = React.createClass({
  displayName: 'Report-Module',
  getDefaultProps () {
    return {
      editable: false
    }
  },
  propTypes: {
    editable: PropTypes.bool,
    id: PropTypes.string.isRequired,
    entity: reportEntityType,
    reportParams: reportParamsType
  },
  contextTypes: {
    tree: PropTypes.object,
    params: PropTypes.object
  },
  getInitialState () {
    return {
      lastUpdate: Date.now()
    }
  },
  componentWillMount () {
    const {tree, params} = this.context

    // @todo adapt for other report locations (e.g. workspace)

    const modulePath = getDeepCursor(tree, [
      'user',
      ['companies', params.company],
      ['workspaces', params.workspace],
      ['folders', params.folder],
      ['reports', params.report],
      ['modules', this.props.id]
    ])

    this.fetchResult = debounce(query => {
      loadReportModuleResultAction(tree, params, this.props.id, query)
    }, 1000)

    this.cursor = tree.select(modulePath)

    this.cursor.on('update', () => {
      this.setState({
        lastUpdate: Date.now()
      })
    })
  },
  componentDidMount () {
    this.load()
  },
  componentWillUnmount () {
    this.cursor.release()
    this.cursor = null
  },
  shouldComponentUpdate (nextProps, nextState) {
    return (
      nextState.lastUpdate !== this.state.lastUpdate ||
      nextProps.reportParams.from !== this.props.reportParams.from ||
      nextProps.reportParams.to !== this.props.reportParams.to
    )
  },
  getChartQuery () {
    const {entity, reportParams} = this.props
    const module = this.cursor.get()
    const filters = assign({}, module.filters)

    if (isEmpty(filters.id)) {
      filters.id = entity.list.map(({id}) => id)
    }

    return assign({filters, entity: entity.id},
      pick(module, 'dimensions', 'metrics'),
      pick(reportParams, 'ad_account', 'tetris_account', 'platform', 'from', 'to')
    )
  },
  load () {
    const query = this.getChartQuery()

    if (isvalidReportQuery(query)) {
      this.fetchResult(query)
    }
  },
  remove () {
    // this.props.remove(this.props.module.id)
  },
  save (updatedModule) {
    this.cursor.merge(updatedModule)
  },
  render () {
    return (
      <Module
        {...this.props}
        update={this.save}
        remove={this.remove}
        module={this.cursor.get()}/>
    )
  }
})

export default ReportModule
