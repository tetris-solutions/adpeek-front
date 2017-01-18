import camelCase from 'lodash/camelCase'
import cloneDeep from 'lodash/cloneDeep'
import diff from 'lodash/differenceWith'
import isFunction from 'lodash/isFunction'
import find from 'lodash/find'
import forEach from 'lodash/forEach'
import includes from 'lodash/includes'
import isArray from 'lodash/isArray'
import isEmpty from 'lodash/isEmpty'
import isEqual from 'lodash/isEqual'
import isEqualWith from 'lodash/isEqualWith'
import isObject from 'lodash/isObject'
import isString from 'lodash/isString'
import lowerCase from 'lodash/toLower'
import merge from 'lodash/merge'
import omit from 'lodash/omit'
import React from 'react'

let Highcharts

function isUpperCase (letter) {
  return letter !== letter.toLowerCase()
}

function looksLikeAnEventHandler (name) {
  return name.length > 2 && name.substr(0, 2) === 'on' && isUpperCase(name[2])
}

const defaultConfig = {
  credits: {
    enabled: false
  },
  exporting: {
    fallbackToExportServer: false,
    type: 'image/jpeg'
  },
  navigation: {
    buttonOptions: {
      enabled: false
    }
  }
}

const seriesTypes = [
  'area',
  'arearange',
  'areaspline',
  'areasplinerange',
  'bar',
  'boxplot',
  'bubble',
  'column',
  'columnrange',
  'errorbar',
  'funnel',
  'gauge',
  'heatmap',
  'line',
  'pie',
  'polygon',
  'pyramid',
  'scatter',
  'solidgauge',
  'spline',
  'treemap',
  'waterfall'
]

function parseChildren (child, parent) {
  if (isString(child)) {
    parent.name = child || ''
    return
  }

  if (isArray(child)) {
    React.Children.forEach(child, x => parseChildren(x, parent))
    return
  }

  if (!isObject(child)) return

  const {props} = child
  const type = camelCase(child.type)
  const node = omit(props, 'children')

  if (isEmpty(node) && !isObject(props.children) && !isArray(props.children)) {
    if (type === 'title') {
      parent.title = {
        text: props.children
      }
    } else {
      parent[type] = props.children === undefined
        ? true
        : props.children
    }

    return
  }

  forEach(node, (value, name) => {
    if (looksLikeAnEventHandler(name)) {
      node.events = node.events || {}
      node.events[lowerCase(name.slice(2))] = value
    }
  })

  if (parent.isRoot && includes(seriesTypes, type)) {
    node.type = type
    node.isSeries = true
    parent.series = parent.series || []
    parent.series.push(node)
  } else if (parent.isSeries && type === 'point') {
    parent.data = parent.data || []
    parent.data.push(node)
  } else {
    parent[type] = node
  }

  React.Children.forEach(props.children, children =>
    parseChildren(children, node))
}

function mapPropsToConfig (props) {
  props = cloneDeep(props)
  const parentConfig = props.config
  const chart = omit(props, 'config', 'tag', 'children', 'className', 'style')
  const config = {isRoot: true}

  if (!isEmpty(chart)) config.chart = chart

  parseChildren(props.children, config)

  delete config.isRoot

  return merge({}, defaultConfig, config, parentConfig)
}

const isSameSeries = (chartSeries, updated) => chartSeries.options.id === updated.id
const doNotRedraw = false
function removeSeries (series) {
  series.remove(doNotRedraw)
}

function customComparison (a, b, key) {
  if (isFunction(a) && isFunction(b)) {
    return true
  }
  if (key === 'categories') {
    return true
  }
}

function hasChanged (configA, configB) {
  const newOptionsForComparision = omit(configA, 'series', 'title')
  const oldOptionsForComparison = omit(configB, 'series', 'title')

  return !isEqualWith(newOptionsForComparision, oldOptionsForComparison, customComparison)
}

export const Chart = React.createClass({
  displayName: 'Highcharts',
  propTypes: {
    tag: React.PropTypes.string,
    children: React.PropTypes.node,
    className: React.PropTypes.string,
    style: React.PropTypes.object
  },
  getDefaultProps () {
    return {
      tag: 'div'
    }
  },
  getInitialState () {
    return {
      config: mapPropsToConfig(this.props)
    }
  },
  componentDidMount () {
    this.draw()
  },
  draw () {
    this.refs.container.HCharts = this.chart = Highcharts.chart(
      this.refs.container,
      cloneDeep(this.state.config)
    )
  },
  hardRedraw () {
    this.chart.destroy()
    this.draw()
  },
  updateSeries (series) {
    const oldSeries = find(this.chart.series, ['options.id', series.id])

    if (!oldSeries) {
      return this.chart.addSeries(series, doNotRedraw)
    }

    oldSeries.setData(series.data, doNotRedraw)
  },
  componentWillReceiveProps (props) {
    const newConfig = mapPropsToConfig(props)

    if (!isEqual(newConfig.title, this.state.config.title)) {
      this.chart.setTitle(newConfig.title)
    }

    if (hasChanged(newConfig, this.state.config)) {
      this.setState({config: newConfig}, this.hardRedraw)
    } else {
      this.setState({config: newConfig})

      const removed = diff(this.chart.series, newConfig.series, isSameSeries)

      forEach(removed, removeSeries)
      forEach(newConfig.series, this.updateSeries)

      this.chart.redraw()
    }
  },
  shouldComponentUpdate () {
    return false
  },
  render () {
    const {tag, className, style} = this.props

    return React.createElement(tag, {
      ref: 'container',
      className,
      style
    })
  }
})

export default React.createClass({
  displayName: 'Loader',
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

      this.forceUpdate()
    })
  },
  render () {
    return Highcharts ? <Chart {...this.props}/> : null
  }
})
