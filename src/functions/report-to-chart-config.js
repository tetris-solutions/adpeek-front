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
  let xAxisDimension, isDateBased, isIdBased

  if (includes(dimensions, 'date')) {
    xAxisDimension = 'date'
    isDateBased = true
  } else if (includes(dimensions, 'id')) {
    xAxisDimension = 'id'
    isIdBased = true
  } else {
    xAxisDimension = dimensions[0] || null
  }

  if (isDateBased) {
    result = sortBy(result, xAxisDimension)
  }

  dimensions = without(dimensions, xAxisDimension)

  const series = []

  function rowIterator (point, index) {
    const pointDimensions = pick(point, dimensions)

    const referenceEntity = (
        point.id !== undefined &&
        find(entity.list, {id: point.id})
      ) || {
        id: point.id || index,
        name: point.id || index
      }

    if (isIdBased) {
      categories.push(referenceEntity.name)
    } else if (!isDateBased && isString(point[xAxisDimension])) {
      categories.push(point[xAxisDimension])
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
        pointConfig.name = isIdBased ? referenceEntity.name : point[xAxisDimension]
      }

      if (isDateBased) {
        pointConfig.x = new Date(point.date).getTime()
      }

      seriesConfig.data.push(pointConfig)
    }

    forEach(metrics, metricIterator)
  }

  forEach(result, rowIterator)

  const config = {
    yAxis, xAxis: {},
    series
  }

  if (isDateBased) {
    config.xAxis.type = 'datetime'
  }

  if (categories.length) {
    config.xAxis.categories = uniq(categories)
  }

  return config
}
