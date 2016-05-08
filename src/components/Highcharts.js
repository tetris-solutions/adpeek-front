import React from 'react'
import Highcharts from 'highcharts'
import omit from 'lodash/omit'
import isEmpty from 'lodash/isEmpty'
import isObject from 'lodash/isObject'
import isArray from 'lodash/isArray'
import isString from 'lodash/isString'
import includes from 'lodash/includes'
import camelCase from 'lodash/camelCase'

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
    Highcharts.chart(this.refs.container, this.state.config)
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
