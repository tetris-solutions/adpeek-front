import camelCase from 'lodash/camelCase'
import cloneDeep from 'lodash/cloneDeep'
import isFunction from 'lodash/isFunction'
import forEach from 'lodash/forEach'
import includes from 'lodash/includes'
import isArray from 'lodash/isArray'
import isEmpty from 'lodash/isEmpty'
import isEqualWith from 'lodash/isEqualWith'
import isObject from 'lodash/isObject'
import isString from 'lodash/isString'
import lowerCase from 'lodash/toLower'
import merge from 'lodash/merge'
import omit from 'lodash/omit'

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
    forEach(child, x => parseChildren(x, parent))
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

  if (isArray(props.children)) {
    forEach(props.children, children =>
      parseChildren(children, node))
  } else {
    parseChildren(props.children, node)
  }
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

/* global self */

self.addEventListener('message', ({data: {op, id, payload}}) => {
  switch (op) {
    case 'mapPropsToConfig':
      return self.postMessage({
        id,
        result: mapPropsToConfig(payload)
      })
    case 'hasChanged':
      return self.postMessage({
        id,
        result: hasChanged(payload.before, payload.after)
      })
  }
})
