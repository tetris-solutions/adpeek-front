import React from 'react'
import {branch} from 'baobab-react/higher-order'
import {loadReportAction} from '../actions/load-report'
import reportType from '../propTypes/report'
import assign from 'lodash/assign'
import isEqual from 'lodash/isEqual'

const {PropTypes} = React

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

    if (!isEqual(query, this.state.query)) {
      this.setState({query}, this.loadReport)
    }
  },
  getChartQuery (props) {
    props = props || this.props

    if (!props.type) return null

    const {
      /* dimensions, */filters, entity,
      reportParams: {
        ad_account,
        tetris_account,
        platform,
        from,
        to
      }
    } = props

    const ids = filters.id.length
      ? filters.id
      : entity.list.map(({id}) => id)

    if (!ids.length) return null

    return {
      filters: `id(${ids.join('|')})`,
      entity: entity.id,
      ad_account,
      tetris_account,
      platform,
      from,
      to,
      // @todo use dynamic values
      dimensions: 'date',
      metrics: 'clicks'
    }
  },
  loadReport () {
    const {query} = this.state

    if (typeof window === 'undefined' || !query) return

    if (!this.apiPromise) {
      this.apiPromise = Promise.resolve()
    }

    this.setState({isLoading: true})

    this.apiPromise = this.apiPromise
      .then(() => this.props.dispatch(loadReportAction, this.props.id, query))
      .then(() => this.setState({isLoading: false}))
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
  result: ['report', id]
}), ReportChart)
