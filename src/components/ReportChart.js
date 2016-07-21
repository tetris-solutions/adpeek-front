import React from 'react'
import {branch} from 'baobab-react/higher-order'
import {loadReportAction} from '../actions/load-report'
import reportType from '../propTypes/report'
import assign from 'lodash/assign'
import {isvalidReportQuery} from '../functions/is-valid-report-query'
import isEmpty from 'lodash/isEmpty'
import pick from 'lodash/pick'
import Line from './ReportChartLine'
import isEqual from 'lodash/isEqual'

const typeComponent = {
  line: Line
}
const {PropTypes} = React

const ReportChart = React.createClass({
  displayName: 'Report-Chart',
  propTypes: assign({
    result: PropTypes.array,
    query: PropTypes.object,
    dispatch: PropTypes.func,
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
      result: []
    }
  },
  componentDidMount () {
    this.loadReport()
  },
  componentDidUpdate () {
    this.loadReport()
  },
  getChartQuery () {
    const {props} = this
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
    const query = this.getChartQuery()

    if (!isvalidReportQuery(query)) return
    if (isEqual(query, this.props.query)) return

    if (!this.apiPromise) {
      this.apiPromise = Promise.resolve()
    }

    const myCall = this.lastCall = Date.now()
    const skipIfNotLatestCall = fn => () => {
      if (this.lastCall === myCall) {
        return fn()
      }
    }

    const onDoneLoading = skipIfNotLatestCall(() =>
      this.setState({isLoading: false}))

    const makeApiCall = skipIfNotLatestCall(() => {
      this.setState({isLoading: true})

      return this.props.dispatch(loadReportAction, this.props.id, query)
        .then(onDoneLoading)
    })

    this.apiPromise = this.apiPromise
      .then(makeApiCall, makeApiCall)
  },
  render () {
    const Chart = typeComponent[this.props.type]

    return (
      <div>
        <h3>{this.props.type}</h3>
        <Chart {...this.props}/>
      </div>
    )
  }
})

export default branch(({id}) => ({
  result: ['reports', 'modules', id, 'data'],
  query: ['reports', 'modules', id, 'query']
}), ReportChart)
