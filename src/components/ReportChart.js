import React from 'react'
import {branch} from 'baobab-react/higher-order'
import {loadReportAction} from '../actions/load-report'
import reportType from '../propTypes/report'
import assign from 'lodash/assign'
import {isvalidReportQuery} from '../functions/is-valid-report-query'
import isEmpty from 'lodash/isEmpty'
import pick from 'lodash/pick'

const {PropTypes} = React
const onServerSide = typeof window === 'undefined'

const ReportChart = React.createClass({
  displayName: 'Report-Chart',
  propTypes: assign({
    result: PropTypes.array,
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
  getInitialState () {
    return {
      query: this.getChartQuery()
    }
  },
  componentWillMount () {
    this.loadReport()
  },
  componentWillReceiveProps (nextProps) {
    const query = this.getChartQuery(nextProps)

    this.setState({query}, this.loadReport)
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

    if (onServerSide || !isvalidReportQuery(query)) return

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
      .then(makeApiCall)
  },
  render () {
    return (
      <div>
        <h3>{this.props.type}</h3>
        <pre style={{maxHeight: 300, overflowY: 'auto'}}>
          {JSON.stringify(this.props.result, null, 2)}
        </pre>
      </div>
    )
  }
})

export default branch(({id}) => ({
  result: ['reports', 'modules', id, 'data']
}), ReportChart)
