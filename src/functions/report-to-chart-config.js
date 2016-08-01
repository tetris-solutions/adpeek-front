import forEach from 'lodash/forEach'
import includes from 'lodash/includes'
import isEqual from 'lodash/isEqual'
import without from 'lodash/without'
import pick from 'lodash/pick'
import find from 'lodash/find'
import map from 'lodash/map'
import join from 'lodash/join'
import sortBy from 'lodash/sortBy'
import assign from 'lodash/assign'
import isString from 'lodash/isString'
import uniq from 'lodash/uniq'
import omit from 'lodash/omit'
import get from 'lodash/get'
import negate from 'lodash/negate'

const isEntityId = d => d === 'id' || d === 'name'
const notEntityId = negate(isEntityId)

const types = {
  linear: {
    type: 'linear'
  },
  datetime: {
    type: 'datetime',
    sortable: true,
    parse: d => new Date(d).getTime()
  },
  time: {
    type: 'datetime',
    format: '%H:%M',
    sortable: true,
    parse (str) {
      const parts = str.substr(0, '00:00:00'.length)
        .split(':')
        .slice(0, 3)
        .map(Number)
      const d = new Date()

      d.setHours(...parts)

      return d.getTime()
    }
  }
}

function detectXAxis (result, xAxisDimensions) {
  /**
   * first x axis point
   * @type {String}
   */
  const first = get(result, [0, xAxisDimensions])

  if (!isString(first)) {
    return types.linear
  }

  if (xAxisDimensions === 'date') {
    return types.datetime
  }

  if (first.match(/^\d{2}:\d{2}:\d{2}/)) {
    return types.time
  }

  return types.linear
}

export function reportToChartConfig (type, {query: {metrics, dimensions}, result, entity, attributes}) {
  const getAttributeName = attr => get(attributes, [attr, 'name'], attr)
  const getSeriesAttributeName = (val, key) => key === 'metric'
    ? getAttributeName(val)
    : `${getAttributeName(key)}: ${val}`

  const yAxis = map(metrics, (metric, index) => ({
    title: {
      text: getAttributeName(metric)
    },
    opposite: index % 2 !== 0
  }))

  const categories = []
  let xAxisDimension

  if (includes(dimensions, 'date')) {
    xAxisDimension = 'date'
  } else {
    const firstOption = type === 'pie'
      ? find(dimensions, isEntityId)
      : find(dimensions, notEntityId)

    xAxisDimension = firstOption || dimensions[0] || null
  }

  const xAxis = detectXAxis(result, xAxisDimension)
  const isIdBased = xAxisDimension === 'id'

  if (xAxis.sortable) {
    result = sortBy(result, p => xAxis.parse(p[xAxisDimension]))
  }

  dimensions = without(dimensions, xAxisDimension)

  const series = []

  function pointIterator (point, index) {
    const pointDimensions = pick(point, dimensions)

    const referenceEntity = (
        point.id !== undefined &&
        find(entity.list, {id: point.id})
      ) || {
        id: point.id || index,
        name: point.id || index
      }

    if (!xAxis.parse) {
      if (isIdBased) {
        categories.push(referenceEntity.name)
      } else if (isString(point[xAxisDimension])) {
        categories.push(point[xAxisDimension])
      }
    }

    function metricIterator (metric, yAxisIndex) {
      const seriesSignature = assign({metric}, pointDimensions)

      function getNewSeries () {
        const descriptors = map(seriesSignature, (val, key) => `${key}(${val})`)

        const newSeries = {
          type,
          id: join(descriptors, ':'),
          name: join(descriptors, ':'),
          seriesSignature,
          yAxis: yAxisIndex,
          data: []
        }

        const nameParts = map(omit(seriesSignature, 'id'), getSeriesAttributeName)

        if (seriesSignature.id !== undefined) {
          nameParts.unshift(referenceEntity.name)
        }

        if (nameParts.length) {
          newSeries.name = nameParts.join(', ')
        }

        return newSeries
      }

      let seriesConfig = type === 'pie'
        ? series[0] // always one series
        : find(series, s => isEqual(s.seriesSignature, seriesSignature))

      if (!seriesConfig) {
        seriesConfig = getNewSeries()
        series.push(seriesConfig)
      }

      const y = Number(point[metric])
      const pointConfig = {
        id: index,
        y: isNaN(y) ? null : y
      }

      if (type === 'pie') {
        pointConfig.name = isIdBased
          ? referenceEntity.name
          : point[xAxisDimension]
      }

      if (xAxis.parse) {
        pointConfig.x = xAxis.parse(point[xAxisDimension])
      }

      seriesConfig.data.push(pointConfig)
    }

    forEach(metrics, metricIterator)
  }

  forEach(result, pointIterator)

  const config = {
    yAxis,
    xAxis: pick(xAxis, 'type', 'format'),
    series
  }

  if (xAxisDimension) {
    config.xAxis.title = {
      text: getAttributeName(xAxisDimension),
      align: 'low'
    }
  }

  if (categories.length) {
    config.xAxis.categories = uniq(categories)
  }

  return config
}
