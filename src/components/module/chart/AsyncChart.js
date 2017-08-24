import React from 'react'
import chartType from '../../../propTypes/report-chart'
import {reportToChartConfig} from '../../../functions/report-to-chart-config'

class AsyncChart extends React.Component {
  static displayName = 'Async-Chart'
  static propTypes = chartType

  state = {config: {}}

  componentDidMount () {
    this.promise = this.reload()
  }

  componentWillReceiveProps () {
    this.promise = this.promise.then(this.reload)
  }

  reload = () => {
    return reportToChartConfig(this.props.config)
      .then(config => this.setState({config}))
  }
}

export default AsyncChart
