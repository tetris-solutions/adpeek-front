import csjs from 'csjs'
import React from 'react'
import Chart from '../Chart/Chart'
import {styled} from '../../mixins/styled'

const style = csjs`
.card, .content, .content > div {
  width: 100%;
}`

const {PropTypes} = React

const ModuleCard = React.createClass({
  displayName: 'Module-Card',
  mixins: [styled(style)],
  propTypes: {
    children: PropTypes.node.isRequired
  },
  contextTypes: {
    module: PropTypes.object.isRequired
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
          <Chart height={this.context.module.rows * 100}/>
        </div>
        {this.props.children}
      </div>
    )
  }
})

export default ModuleCard
