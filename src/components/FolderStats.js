import React from 'react'
import PropTypes from 'prop-types'
import Message from 'tetris-iso/Message'
import Highcharts from './Highcharts'
import {prettyNumber} from '../functions/pretty-number'
import {loadFolderStatsAction} from '../actions/load-folder-stats'
import compact from 'lodash/compact'
import {pure} from 'recompose'
import csjs from 'csjs'
import {styledComponent} from './higher-order/styled'
import map from 'lodash/map'
import isNumber from 'lodash/isNumber'
import get from 'lodash/get'
import last from 'lodash/last'

const style = csjs`
.wrapper {
  height: 334px;
  padding: 1em .5em;
}
.section {
  margin-bottom: .5em;
}
.chart {
  width: 100%;
  height: 180px;
}
.label {
  color: grey;
  font-weight: 500;
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
}
.empty {
  text-align: center;
}
.empty h6 > small {
  font-size: .8em;
}`

const labelStyle = {
  fontSize: '10px'
}
const dt = str => {
  const [year, month, day] = str.split('-')
  const d = new Date(year, month - 1, day)

  d.setHours(0, 0, 0, 0)

  return d.getTime()
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
  amount: PropTypes.number,
  cost: PropTypes.number
}
Rail.contextTypes = {
  locales: PropTypes.string.isRequired
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
  start: PropTypes.string,
  end: PropTypes.string
}
Period.contextTypes = {
  moment: PropTypes.func.isRequired
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
  series: PropTypes.array,
  metric: PropTypes.shape({
    id: PropTypes.string,
    type: PropTypes.string,
    name: PropTypes.string
  }),
  kpi_goal: PropTypes.number
}

Goal.contextTypes = {
  locales: PropTypes.string.isRequired
}

function preventDefault (e) {
  e.preventDefault()
}

let Stats = ({stats, kpi_goal}, {messages, locales}) => (
  <div className={`${style.wrapper} mdl-color-text--grey-600`}>
    <Rail
      cost={get(stats, 'orders.current.cost')}
      amount={get(stats, 'orders.current.amount')}/>

    <Goal
      kpi_goal={kpi_goal}
      series={stats.series}
      metric={stats.metric}/>

    <Period
      start={get(stats, 'orders.current.start')}
      end={get(stats, 'orders.current.end')}/>

    <Highcharts
      config={{
        yAxis: compact([
          {
            id: 'budget',
            title: {
              text: null
            },
            labels: {
              enabled: false
            }
          },
          stats.metric && {
            id: stats.metric.id,
            title: {
              text: null
            },
            labels: {
              enabled: false
            }
          }
        ])
      }}
      className={`${style.chart}`}
      onClick={preventDefault}>

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

      <legend>
        <item-style>
          <font-size>8pt</font-size>
        </item-style>
      </legend>

      <tooltip
        useHTML
        shared
        formatter={function () {
          return this.points.map(point => `
            <span style="font-weight: bold; color: ${point.color}">
              ${prettyNumber(point.y, point.series.options.metric.type, locales)}
            </span>`
          ).join('<br/>')
        }}/>

      <x-axis>
        <type>datetime</type>
        <title>{null}</title>
        <labels style={labelStyle}/>
      </x-axis>

      <line id='budget' name={messages.investmentLabel} metric={{type: 'currency'}} yAxis='budget'>
        {map(stats.series, (x, index) =>
          <point
            key={`${x.date}-budget-${index}`}
            id={`${x.date}-budget-${index}`}
            x={dt(x.date)}
            y={x.cost}/>)}
      </line>

      {stats.metric && (
        <line id={stats.metric.id} name={stats.metric.name} metric={stats.metric} yAxis={stats.metric.id}>
          {map(stats.series, (x, index) =>
            <point
              key={`${x.date}-${stats.metric.id}-${index}`}
              id={`${x.date}-${stats.metric.id}-${index}`}
              x={dt(x.date)}
              y={x[stats.metric.id]}/>)}
        </line>)}
    </Highcharts>
  </div>
)

Stats.displayName = 'Stats'
Stats.propTypes = {
  kpi_goal: PropTypes.number,
  stats: PropTypes.shape({
    metric: PropTypes.object,
    series: PropTypes.arrayOf(PropTypes.shape({
      date: PropTypes.string,
      cost: PropTypes.number
    }))
  }).isRequired
}
Stats.contextTypes = {
  messages: PropTypes.object.isRequired,
  locales: PropTypes.string.isRequired
}

Stats = pure(Stats)

const EmptyStats = ({lastOrder}, {moment}) => (
  <div className={`${style.wrapper} ${style.empty} mdl-color-text--grey-600`}>
    <br/><br/><br/><br/>
    <div className={`${style.section}`}>{lastOrder
      ? (
        <h6>
          <Message>lastActiveOrder</Message>:
          <br/>
          <small>
            {moment(lastOrder.end).fromNow()}
          </small>
        </h6>
      ) : (
        <h6>
          <Message>noActiveOrder</Message>
        </h6>)}
    </div>
  </div>
)

EmptyStats.displayName = 'Empty-Stats'
EmptyStats.propTypes = {
  lastOrder: PropTypes.object
}
EmptyStats.contextTypes = {
  moment: PropTypes.func
}

class FolderStats extends React.Component {
  static displayName = 'Folder-Stats'

  static propTypes = {
    id: PropTypes.string,
    params: PropTypes.object,
    stats: PropTypes.object,
    kpi_goal: PropTypes.number
  }

  static contextTypes = {
    tree: PropTypes.object.isRequired,
    locales: PropTypes.string.isRequired,
    messages: PropTypes.object.isRequired
  }

  static defaultProps = {
    stats: {}
  }

  componentDidMount () {
    loadFolderStatsAction(
      this.context.tree,
      this.props.params,
      this.props.id
    )
  }

  render () {
    const {kpi_goal, stats} = this.props

    return !stats.orders || stats.orders.current
      ? <Stats kpi_goal={kpi_goal} stats={stats}/>
      : <EmptyStats lastOrder={stats.orders.last}/>
  }
}

export default styledComponent(FolderStats, style)
