import React from 'react'
import chartType from '../../../propTypes/report-chart'
import {reportToChartConfig} from '../../../functions/report-to-chart-config'
import {queued} from '../../../functions/queued'

class AsyncChart extends React.Component {
  static displayName = 'Async-Chart'
  static propTypes = chartType

  state = {config: {}}

  componentDidMount () {
    this.reload()
  }

  componentWillReceiveProps (nextProps) {
    this.reload(nextProps)
  }

  reload = queued((props = this.props) =>
    reportToChartConfig(props.config)
      .then(config => this.setState({config})))
}

export default AsyncChart
