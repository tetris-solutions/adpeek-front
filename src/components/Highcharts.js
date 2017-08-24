import React from 'react'
import PropTypes from 'prop-types'
import log from 'loglevel'
import pick from 'lodash/pick'
import diff from 'lodash/differenceWith'
import find from 'lodash/find'
import get from 'lodash/get'
import forEach from 'lodash/forEach'
import isEqual from 'lodash/isEqual'
import cloneDeep from 'lodash/cloneDeep'
import {mapPropsToConfig, requiresFullRedraw} from '../functions/highcart-config'

let Highcharts

const isSameSeries = (chartSeries, updated) => chartSeries.options.id === updated.id

function removeSeries (series) {
  series.remove(false)
}

export class Chart extends React.Component {
  static displayName = 'Highcharts'

  static propTypes = {
    tag: PropTypes.string,
    children: PropTypes.node,
    className: PropTypes.oneOfType([PropTypes.string, PropTypes.object]),
    style: PropTypes.object
  }

  static defaultProps = {
    tag: 'div'
  }

  state = {}

  promise = Promise.resolve()

  componentDidMount () {
    this.enqueue(() =>
      mapPropsToConfig(this.props)
        .then(this.updateConfig)
        .then(this.draw))

    window.event$.on('aside-toggle', this.resizer)
  }

  componentWillReceiveProps (props) {
    this.enqueue(() =>
      mapPropsToConfig(props)
        .then(this.handleConfig))
  }

  shouldComponentUpdate () {
    return false
  }

  componentWillUnmount () {
    this.dead = true

    window.event$.off('aside-toggle', this.resizer)
  }

  enqueue = fn => {
    const stopIfDead = () => {
      if (this.dead) {
        return Promise.reject('Highchart has been unmounted mid update')
      }
    }

    const bypassErr = err => {
      log.error(err)
      return fn()
    }

    const proceed = () => Promise.resolve()
      .then(fn, bypassErr)

    this.promise = this.promise
      .then(stopIfDead)
      .then(proceed)
  }

  resizer = () => {
    this.chart.reflow()
  }

  draw = () => {
    if (this.state.config) {
      this.refs.container.HCharts = this.chart = Highcharts.chart(
        this.refs.container,
        cloneDeep(this.state.config)
      )
    }
  }

  hardRedraw = () => {
    if (this.chart) {
      this.chart.destroy()
    }
    this.draw()
  }

  updateSeries = (series) => {
    const oldSeries = find(this.chart.series, ['options.id', series.id])

    if (!oldSeries) {
      return this.chart.addSeries(series, false)
    }

    oldSeries.setData(series.data, false)
  }

  handleConfig = newConfig => {
    if (!isEqual(newConfig.title, get(this, 'state.config.title'))) {
      this.chart.setTitle(newConfig.title)
    }

    const update = isNewChart => {
      if (isNewChart) {
        this.enqueue(() =>
          this.updateConfig(newConfig)
            .then(this.hardRedraw))
      } else {
        this.updateConfig(newConfig)

        const removed = diff(this.chart.series, newConfig.series, isSameSeries)

        forEach(removed, removeSeries)
        forEach(newConfig.series, this.updateSeries)

        this.chart.redraw()
      }
    }

    requiresFullRedraw(this.state.config, newConfig)
      .then(update)
  }

  updateConfig = config => new Promise(resolve => {
    this.setState({config}, resolve)
  })

  render = () => {
    const props = pick(this.props, 'className', 'style', 'onClick')

    props.ref = 'container'

    return React.createElement(this.props.tag, props)
  }
}

export default class extends React.Component {
  static displayName = 'Loader'

  componentDidMount () {
    require.ensure([], require => {
      Highcharts = require('highcharts/highstock')

      require('highcharts/modules/exporting')(Highcharts)
      require('highcharts/modules/offline-exporting.src')(Highcharts)

      window.Highcharts = Highcharts

      Highcharts.setOptions({
        global: {
          useUTC: false
        }
      })

      Highcharts.dateFormats = {
        W (timestamp) {
          const date = new Date(timestamp)
          const day = date.getUTCDay() === 0 ? 7 : date.getUTCDay()

          date.setDate(date.getUTCDate() + 4 - day)

          const dayNumber = Math.floor((date.getTime() - new Date(date.getUTCFullYear(), 0, 1, -6)) / 86400000)
          const w = 1 + Math.floor(dayNumber / 7)

          return ('0' + w).substr(-2)
        }
      }

      this.forceUpdate()
    })
  }

  render () {
    return Highcharts ? <Chart {...this.props}/> : null
  }
}
