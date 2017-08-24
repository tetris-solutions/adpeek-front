import React from 'react'
import chartType from '../../../propTypes/report-chart'
import noop from 'lodash/noop'
import get from 'lodash/get'
import set from 'lodash/set'
import {prettyNumber} from '../../../functions/pretty-number'
import forEach from 'lodash/forEach'
import find from 'lodash/find'
import {randomString} from '../../../functions/random-string'
import {canUseWorker} from '../../../functions/can-user-worker'
import omit from 'lodash/omit'

const queue = {}
const worker = canUseWorker()
  ? (W => new W())(require('worker-loader!./../../../workers/chart-config-generator'))
  : {addEventListener: noop, postMessage: noop}

worker.addEventListener('message', ({data: {id, result}}) => {
  if (queue[id]) {
    queue[id](result)
    delete queue[id]
  }
})

function createConfig (payload) {
  const id = randomString()

  return new Promise(resolve => {
    queue[id] = resolve

    const msg = {
      id,
      payload
    }

    worker.postMessage(msg)
  })
}

const readType = attr => attr.type === 'special' && attr.is_percentage
  ? 'percentage'
  : attr.type

function plainMessage () {
  /**
   *
   * @type {Highcharts.Chart}
   */
  const chart = this

  const x = (chart.chartWidth / 2) - 50
  const y = (chart.chartHeight / 2) - 20

  const label = chart._label_ = chart._label_ || chart.renderer.label().add()

  label.textSetter(chart.userOptions.labelMessage)
  label.ySetter(y)
  label.xSetter(x)
  label.css({fontStyle: 'italic', fontSize: '12pt'})
}

const pointFormatter = ({locales, attributes}) => function () {
  const attribute = attributes[this.options.metric]
  const value = prettyNumber(this.y, readType(attribute), locales)

  return `
        <span style="color: ${this.color}">${this.series.name}:</span>
        <b>${value}</b>
        ${this.options.raw ? `<em>${this.options.raw}</em>` : ''}
        <br/>`
}

function attachCallbacks (props, config) {
  if (config.series) {
    set(config, [
      'plotOptions',
      'series',
      'tooltip',
      'pointFormatter'
    ], pointFormatter(props))

    forEach(config.yAxis, ({metric, labels}) =>
      set(labels, 'formatter', function formatter () {
        return prettyNumber(
          this.value,
          readType(props.attributes[metric]),
          module.locales
        )
      }))

    const commentSeries = find(config.series, {id: 'comments'})

    if (commentSeries) {
      set(commentSeries, ['tooltip', 'pointFormatter'], function pointFormatter () {
        return this.text
      })
    }
  }

  if (get(config, ['chart', 'events', 'load'])) {
    set(config, ['chart', 'events', 'load'], plainMessage)
    set(config, ['chart', 'events', 'redraw'], plainMessage)
  }

  return config
}

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

  prepareConfig = rawConfig => {
    const sourceOptions = this.props.config
    const config = attachCallbacks(sourceOptions, rawConfig)

    this.setState({config})
  }

  reload = () => {
    return createConfig(omit(this.props.config, 'change')).then(this.prepareConfig)
  }
}

export default AsyncChart
