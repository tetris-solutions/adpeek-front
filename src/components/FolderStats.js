import React from 'react'
import Message from 'tetris-iso/Message'
import Highcharts from './Highcharts'
import {prettyNumber} from '../functions/pretty-number'
import {loadFolderStatsAction} from '../actions/load-folder-stats'
import cx from 'classnames'
import csjs from 'csjs'
import {styled} from './mixins/styled'
import map from 'lodash/map'
import isNumber from 'lodash/isNumber'
import get from 'lodash/get'
import last from 'lodash/last'

const style = csjs`
.wrapper {
  padding: 1em .5em;
}
.section {
  margin-bottom: .5em;
}
.chart {
  width: 100%;
  height: 150px;
}
.label {
  color: grey;
  font-weight: 500;
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
}
.rail {
  background-color: grey;
  overflow: hidden;
  border-radius: 3px;
  padding: 2px;
  margin-bottom: 1em;
}
.rail > div {
  border-radius: 3px;
  height: 4px;
}
.stats {
  padding: 0 1em 0 .5em;
  font-size: smaller;
}
.numbers {
  display: block;
  text-overflow: ellipsis;
  overflow: hidden;
  white-space: nowrap;
  font-size: small;
}
.numbers > strong {
  font-size: 105%;
}`

const labelStyle = {
  fontSize: '10px'
}
const dt = str => {
  const [year, month, day] = str.split('-')
  return new Date(year, month - 1, day)
}

const num = val => !isNumber(val) ? 0 : val
const division = (a, b) => b === 0 ? 0 : a / b

const Rail = ({cost, amount}, {locales}) => (
  <div className={`${style.section}`}>
    <div className={`${style.label}`}>
      <Message>investmentLabel</Message>:
    </div>

    <div className={`${style.stats}`}>
      <div className={`${style.numbers}`}>
        <strong className='mdl-color-text--blue-A700'>
          {!isNumber(cost)
            ? '--'
            : prettyNumber(cost, 'currency', locales)}
        </strong>
        <span>{' / ' + (!isNumber(amount) ? '--' : prettyNumber(amount, 'currency', locales))}</span>
      </div>
      <div className={`mdl-color--grey-300 ${style.rail}`}>
        <div
          style={{width: Math.min(100, Math.floor(100 * division(num(cost), num(amount)))) + '%'}}
          className={num(cost) > num(amount)
            ? 'mdl-color--red-800'
            : 'mdl-color--primary'}/>
      </div>
    </div>
  </div>
)

Rail.displayName = 'Rail'
Rail.propTypes = {
  amount: React.PropTypes.number,
  cost: React.PropTypes.number
}
Rail.contextTypes = {
  locales: React.PropTypes.string.isRequired
}

const Period = ({start, end}, {moment, locales}) => (
  <div className={`${style.section}`}>
    <div className={`${style.label}`}>
      <Message>orderRangeTitle</Message>:
    </div>
    <div className={`${style.stats}`}>
      {start
        ? moment(start).format('D/MMM') + ' - ' + moment(end).format('D/MMM')
        : '---'}
    </div>
  </div>
)
Period.displayName = 'Period'
Period.propTypes = {
  start: React.PropTypes.string,
  end: React.PropTypes.string
}
Period.contextTypes = {
  moment: React.PropTypes.func.isRequired
}

const Goal = ({series, metric, kpi_goal}, {locales}) => {
  const currentValue = get(last(series), get(metric, 'id'))

  return (
    <div className={`${style.section}`}>
      <div className={`${style.label}`}>
        <Message metric={get(metric, 'name')}>kpiGoalMetricTitle</Message>:
      </div>
      <div className={`${style.stats}`}>
        <Message
          currentValue={currentValue
            ? prettyNumber(currentValue, get(metric, 'type'), locales)
            : '--'}
          goal={kpi_goal
            ? prettyNumber(kpi_goal, get(metric, 'type'), locales)
            : '--'}>
          kpiGoalMetricResult
        </Message>
      </div>
    </div>
  )
}

Goal.displayName = 'Goal'

Goal.propTypes = {
  series: React.PropTypes.array,
  metric: React.PropTypes.shape({
    id: React.PropTypes.string,
    type: React.PropTypes.string,
    name: React.PropTypes.string
  }),
  kpi_goal: React.PropTypes.number
}
Goal.contextTypes = {
  locales: React.PropTypes.string.isRequired
}

const Stats = ({selectedSeries, selectBudget, selectKPI, stats, labelFormatter, pointFormatter, kpi_goal}) => (
  <div className={`${style.wrapper} mdl-color-text--grey-600`}>
    <Rail
      cost={get(stats, 'order.cost')}
      amount={get(stats, 'order.amount')}/>

    <Goal
      kpi_goal={kpi_goal}
      series={stats.series}
      metric={stats.metric}/>

    <Period
      start={get(stats, 'order.start')}
      end={get(stats, 'order.end')}/>

    <span className={cx({[style.bt]: true, [style.selected]: selectedSeries === 'budget'})} onClick={selectBudget}>
      <Message>investmentLabel</Message>
    </span>

    <span className={cx({[style.bt]: true, [style.selected]: selectedSeries === 'kpi'})} onClick={selectKPI}>
      {get(stats, 'metric.name', '...')}
    </span>

    <Highcharts className={`${style.chart}`} onClick={e => e.preventDefault()}>
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

      <tooltip
        headerFormat=''/>

      <x-axis>
        <type>datetime</type>
        <title>{null}</title>
        <labels style={labelStyle}/>
      </x-axis>

      <y-axis>
        <title>{null}</title>
        <labels enabled={false}/>
      </y-axis>

      <line id={selectedSeries}>
        <tooltip pointFormatter={pointFormatter}/>
        {map(stats.series, (x, index) =>
          <point
            key={`${x.date}-${selectedSeries}-${index}`}
            id={`${x.date}-${selectedSeries}-${index}`}
            x={dt(x.date)}
            y={selectedSeries === 'kpi'
              ? x[stats.metric.id]
              : x.cost}/>)}
      </line>
    </Highcharts>
  </div>
)

Stats.displayName = 'Stats'
Stats.propTypes = {
  kpi_goal: React.PropTypes.number,
  selectedSeries: React.PropTypes.oneOf(['budget', 'kpi']).isRequired,
  selectBudget: React.PropTypes.func.isRequired,
  selectKPI: React.PropTypes.func.isRequired,
  stats: React.PropTypes.shape({
    metric: React.PropTypes.object,
    series: React.PropTypes.arrayOf(React.PropTypes.shape({
      date: React.PropTypes.string,
      cost: React.PropTypes.number
    }))
  }).isRequired,
  labelFormatter: React.PropTypes.func.isRequired,
  pointFormatter: React.PropTypes.func.isRequired
}
Stats.contextTypes = {
  locales: React.PropTypes.string.isRequired
}

const FolderStats = React.createClass({
  displayName: 'Folder-Stats',
  mixins: [styled(style)],
  propTypes: {
    id: React.PropTypes.string,
    params: React.PropTypes.object,
    stats: React.PropTypes.object,
    kpi_goal: React.PropTypes.number
  },
  contextTypes: {
    tree: React.PropTypes.object.isRequired,
    locales: React.PropTypes.string.isRequired,
    messages: React.PropTypes.object.isRequired
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
  componentWillMount () {
    this.setupFormatters()
  },
  componentDidMount () {
    loadFolderStatsAction(
      this.context.tree,
      this.props.params,
      this.props.id
    )
  },
  setupFormatters () {
    const component = this

    this.labelFormatter = function () {
      const {locales} = component.context
      const {selectedSeries} = component.state
      const {stats} = component.props

      const metricView = selectedSeries === 'kpi'
      const seriesType = metricView ? stats.metric.type : 'currency'

      return prettyNumber(this.value, seriesType, locales)
    }

    this.pointFormatter = function () {
      const {locales} = component.context
      const {selectedSeries} = component.state
      const {stats} = component.props

      const metricView = selectedSeries === 'kpi'
      const seriesType = metricView ? stats.metric.type : 'currency'
      const value = prettyNumber(this.y, seriesType, locales)

      return `<span style="font-weight: bold; color: ${this.color}">${value}</span>`
    }
  },
  selectKPI (e) {
    e.preventDefault()
    this.setState({selectedSeries: 'kpi'})
  },
  selectBudget (e) {
    e.preventDefault()
    this.setState({selectedSeries: 'budget'})
  },
  render () {
    return (
      <Stats
        kpi_goal={this.props.kpi_goal}
        stats={this.props.stats}
        selectedSeries={this.state.selectedSeries}
        selectBudget={this.selectBudget}
        selectKPI={this.selectKPI}
        labelFormatter={this.labelFormatter}
        pointFormatter={this.pointFormatter}/>
    )
  }
})

export default FolderStats
