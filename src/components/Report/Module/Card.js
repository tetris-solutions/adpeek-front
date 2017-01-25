import csjs from 'csjs'
import React from 'react'
import Chart from '../Chart/Chart'
import {styled} from '../../mixins/styled'

const style = csjs`
.card, .content, .content > div {
  width: 100%;
  height: 100%;
}`

const ModuleCard = React.createClass({
  displayName: 'Module-Card',
  mixins: [styled(style)],
  propTypes: {
    children: React.PropTypes.node.isRequired
  },
  contextTypes: {
    module: React.PropTypes.object.isRequired
  },
  componentWillReceiveProps (props, {module: {cols, rows}}) {
    const {module} = this.context

    this.repaintChart = cols !== module.cols || rows !== module.rows
  },
  componentDidUpdate () {
    if (this.repaintChart) {
      delete this.repaintChart
      this.reflow()
    }
  },
  reflow () {
    const resizedChart = this.refs.chartWrapper.querySelector('div[data-highcharts-chart]')

    if (resizedChart) {
      resizedChart.HCharts.reflow()
    }
  },
  render () {
    return (
      <div className={`mdl-card mdl-shadow--2dp ${style.card}`}>
        <div ref='chartWrapper' className={`mdl-card__title mdl-card--expand ${style.content}`}>
          <Chart />
        </div>
        {this.props.children}
      </div>
    )
  }
})

export default ModuleCard
