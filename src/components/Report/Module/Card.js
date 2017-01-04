import csjs from 'csjs'
import React from 'react'
import Chart from '../Chart/Chart'
import {styled} from '../../mixins/styled'
import sizeMe from 'react-sizeme'

const style = csjs`
.card, .content, .content > div {
  width: 100%;
  height: 100%;
}`

const ChartRenderer = sizeMe({monitorHeight: true})(props =>
  <Chart height={props.size.height}/>)

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
  componentDidMount () {
    this.resizer = () => this.reflow()
    window.event$.on('aside-toggle', this.resizer)
  },
  componentDidUpdate () {
    if (this.repaintChart) {
      delete this.repaintChart
      this.reflow()
    }
  },
  componentWillUnmount () {
    window.event$.off('aside-toggle', this.resizer)
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
          <ChartRenderer />
        </div>
        {this.props.children}
      </div>
    )
  }
})

export default ModuleCard
