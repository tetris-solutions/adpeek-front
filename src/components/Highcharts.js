import React from 'react'
import Highcharts from 'highcharts/highcharts.src'
import omit from 'lodash/omit'
import isEmpty from 'lodash/isEmpty'
import isObject from 'lodash/isObject'
import isArray from 'lodash/isArray'
import isString from 'lodash/isString'
import includes from 'lodash/includes'
import camelCase from 'lodash/camelCase'
import forEach from 'lodash/forEach'
import lowerCase from 'lodash/lowerCase'
import find from 'lodash/find'
import isEqual from 'lodash/isEqual'

function isUpperCase (letter) {
  return letter !== letter.toLowerCase()
}

function looksLikeAnEventHandler (name) {
  return name.length > 2 && name.substr(0, 2) === 'on' && isUpperCase(name[2])
}

const {createElement, createClass, Children, PropTypes} = React

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
    Children.forEach(child, x => parseChildren(x, parent))
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
    parent.series = parent.series || []
    parent.series.push(node)
  } else if (type === 'point') {
    parent.data = parent.data || []
    parent.data.push(node)
  } else {
    parent[type] = node
  }

  Children.forEach(props.children, children =>
    parseChildren(children, node))
}

function mapPropsToConfig (props) {
  if (props.config) return props.config
  const chart = omit(props, 'tag', 'children', 'className', 'style')
  const config = {isRoot: true}

  if (!isEmpty(chart)) config.chart = chart

  parseChildren(props.children, config)

  delete config.isRoot

  return config
}

export const Chart = createClass({
  displayName: 'Highcharts',
  propTypes: {
    tag: PropTypes.string,
    children: PropTypes.node,
    className: PropTypes.string,
    style: PropTypes.object
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
    this.chart = Highcharts.chart(this.refs.container, this.state.config)
  },
  componentWillReceiveProps (props) {
    const newConfig = mapPropsToConfig(props)

    if (!isEqual(newConfig.title, this.state.config.title)) {
      this.chart.setTitle(newConfig.title)
    }

    const options = omit(newConfig, 'series', 'title')
    const oldOptions = omit(this.state.config, 'series', 'title')

    if (!isEqual(options, oldOptions)) {
      this.setState({config: newConfig}, () => {
        this.chart.destroy()
        this.draw()
      })
    } else {
      this.setState({config: newConfig})

      forEach(newConfig.series, series => {
        const oldSerie = find(this.chart.series, ['options.id', series.id])

        if (!oldSerie) {
          return this.chart.addSeries(series)
        }

        oldSerie.setData(series.data)
      })
    }
  },
  shouldComponentUpdate () {
    return false
  },
  render () {
    const {tag, className, style} = this.props

    return createElement(tag, {
      ref: 'container',
      className,
      style
    })
  }
})

export default Chart
