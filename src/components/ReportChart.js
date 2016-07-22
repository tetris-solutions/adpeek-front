import React from 'react'
import {branch} from 'baobab-react/higher-order'
import {loadReportAction} from '../actions/load-report'
import reportType from '../propTypes/report'
import assign from 'lodash/assign'
import {isvalidReportQuery} from '../functions/is-valid-report-query'
import isEmpty from 'lodash/isEmpty'
import pick from 'lodash/pick'
import Line from './ReportChartLine'
import Column from './ReportChartColumn'
import Pie from './ReportChartPie'
import isEqual from 'lodash/isEqual'

const typeComponent = {
  line: Line,
  pie: Pie,
  column: Column
}
const {PropTypes} = React

const ReportChart = React.createClass({
  displayName: 'Report-Chart',
  propTypes: assign({
    result: PropTypes.array,
    query: PropTypes.object,
    dispatch: PropTypes.func,
    metaData: PropTypes.shape({
      attributes: PropTypes.object
    }),
    reportParams: PropTypes.shape({
      ad_account: PropTypes.string,
      tetris_account: PropTypes.string,
      platform: PropTypes.string,
      from: PropTypes.string,
      to: PropTypes.string
    }).isRequired
  }, reportType),
  getDefaultProps () {
    return {
      result: [],
      metaData: {
        attributes: {}
      }
    }
  },
  getInitialState () {
    return {
      query: this.getChartQuery()
    }
  },
  componentDidMount () {
    this.loadReport()
  },
  componentWillReceiveProps (nextProps) {
    const query = this.getChartQuery(nextProps)

    if (!isEqual(query, this.state.query)) {
      this.setState({query}, this.loadReport)
    }
  },
  componentWillUnmount () {
    this.dead = true
  },
  getChartQuery (props) {
    props = props || this.props
    const {entity} = props
    const filters = assign({}, props.filters)

    if (isEmpty(filters.id)) {
      filters.id = entity.list.map(({id}) => id)
    }

    return assign({filters, entity: entity.id},
      pick(props, 'dimensions', 'metrics'),
      pick(props.reportParams, 'ad_account', 'tetris_account', 'platform', 'from', 'to')
    )
  },
  loadReport () {
    const {query} = this.state

    if (!isvalidReportQuery(query)) return

    const {dispatch, id} = this.props

    this.setState({isLoading: true})

    dispatch(loadReportAction, id, query)
      .then(() => !this.dead && this.setState({isLoading: false}))
  },
  render () {
    const localQuery = this.state.query
    const {type, result, entity, query, metaData: {attributes}} = this.props
    const Chart = typeComponent[type]

    return <Chart attributes={attributes} entity={entity} result={result} query={query || localQuery}/>
  }
})

export default branch(({id, reportParams, entity}) => ({
  metaData: ['reports', 'metaData', reportParams.platform, entity.id],
  result: ['reports', 'modules', id, 'data'],
  query: ['reports', 'modules', id, 'query']
}), ReportChart)
