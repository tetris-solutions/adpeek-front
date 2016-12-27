import React from 'react'
import Message from 'tetris-iso/Message'
import Highcharts from './Highcharts'
import {prettyNumber} from '../functions/pretty-number'
import {loadFolderStatsAction} from '../actions/load-folder-stats'
import cx from 'classnames'
import csjs from 'csjs'
import {styled} from './mixins/styled'
import map from 'lodash/map'

const style = csjs`
.wrapper {
  height: 180px;
}
.chart {
  width: 230px;
  height: 150px;
}
.bt {
  font-size: 9pt;
  cursor: pointer;
  display: inline-block;
  padding: .3em .7em;
  color: #9e9e9e;
}
.bt:hover {
  background: rgba(0, 0, 0, 0.1)
}
.selected {
  color: #283593;
}`

const {PropTypes} = React
const labelStyle = {
  fontSize: '10px'
}
const dt = str => {
  const [year, month, day] = str.split('-')
  return new Date(year, month - 1, day)
}

const FolderStats = React.createClass({
  displayName: 'Folder-Stats',
  mixins: [styled(style)],
  propTypes: {
    id: PropTypes.string,
    params: PropTypes.object,
    stats: PropTypes.object
  },
  contextTypes: {
    tree: PropTypes.object.isRequired,
    locales: PropTypes.string.isRequired,
    messages: PropTypes.object.isRequired
  },
  getDefaultProps () {
    return {
      stats: {}
    }
  },
  getInitialState () {
    return {
      selectedSeries: 'budget'
    }
  },
  componentDidMount () {
    this.setupFormatters()
    loadFolderStatsAction(
      this.context.tree,
      this.props.params,
      this.props.id
    )
  },
  setupFormatters () {
    const component = this

    this.labelFormatter = function () {
      const {locales} = component
      const {selectedSeries} = component.state
      const {stats} = component.props

      const metricView = selectedSeries === 'kpi'
      const seriesType = metricView ? stats.metric.type : 'currency'

      return prettyNumber(this.value, seriesType, locales)
    }

    this.pointFormatter = function () {
      const {messages, locales} = component
      const {selectedSeries} = component.state
      const {stats} = component.props

      const metricView = selectedSeries === 'kpi'
      const seriesType = metricView ? stats.metric.type : 'currency'
      const seriesName = metricView ? stats.metric.name : messages.investmentLabel

      const value = prettyNumber(this.y, seriesType, locales)
      return `<span style="color: ${this.color}">${seriesName}:</span> <b>${value}</b><br/>`
    }
  },
  selectMetric (e) {
    e.preventDefault()
    this.setState({selectedSeries: 'kpi'})
  },
  selectBudget (e) {
    e.preventDefault()
    this.setState({selectedSeries: 'budget'})
  },
  render () {
    const {selectedSeries} = this.state
    const {stats} = this.props
    const isKpiSeries = selectedSeries === 'kpi'

    return (
      <div className={`${style.wrapper}`}>
        <span
          className={cx({
            [style.bt]: true,
            [style.selected]: !isKpiSeries
          })}
          onClick={this.selectBudget}>
          <Message>investmentLabel</Message>
        </span>

        {stats.metric
          ? <span
            className={cx({
              [style.bt]: true,
              [style.selected]: isKpiSeries
            })}
            onClick={this.selectMetric}>{stats.metric.name}</span>
          : null}

        <Highcharts className={String(style.chart)}>
          <title>{null}</title>

          <plot-options>
            <line>
              <marker enabled={false}>
                <states>
                  <hover enabled={false}/>
                </states>
              </marker>
            </line>
          </plot-options>

          <legend enabled={false}/>
          <tooltip enabled={false}/>

          <x-axis>
            <type>datetime</type>
            <title>{null}</title>
            <labels style={labelStyle}/>
          </x-axis>

          <y-axis>
            <title>{null}</title>
            <labels style={labelStyle} formatter={this.labelFormatter}/>
          </y-axis>

          <line id={selectedSeries}>
            <tooltip pointFormatter={this.pointFormatter}/>
            {map(stats.series, (x, index) =>
              <point
                key={`${x.date}-${selectedSeries}-${index}`}
                id={`${x.date}-${selectedSeries}-${index}`}
                x={dt(x.date)}
                y={isKpiSeries
                  ? x[stats.metric.id]
                  : x.cost}/>)}
          </line>
        </Highcharts>
      </div>
    )
  }
})

export default FolderStats
