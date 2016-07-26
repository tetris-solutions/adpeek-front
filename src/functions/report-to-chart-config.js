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
    const getRefEntity = () => find(entity.list, {id: point.id})

    let referenceEntity

    if (isIdBased) {
      referenceEntity = getRefEntity()

      categories.push(referenceEntity
        ? referenceEntity.name
        : point.id)
    } else if (!isDateBased && isString(point[xAxisDimension])) {
      categories.push(point[xAxisDimension])
    }

    function metricIterator (metric, yAxisIndex) {
      const selector = assign({metric}, pointDimensions)

      function getNewSeries () {
        const descriptors = map(selector, (val, key) => `${key}(${val})`)

        const newSeries = {
          type,
          id: join(descriptors, ':'),
          name: join(descriptors, ':'),
          selector,
          yAxis: yAxisIndex,
          data: []
        }

        const nameParts = map(omit(selector, 'id'), getSeriesAttributeName)

        if (selector.id !== undefined) {
          referenceEntity = referenceEntity || getRefEntity()

          if (referenceEntity) {
            nameParts.unshift(referenceEntity.name)
          }
        }

        newSeries.name = nameParts.length
          ? nameParts.join(', ')
          : `# ${series.length + 1}`

        return newSeries
      }

      let seriesConfig = type === 'pie'
        ? series[0] // always one series
        : find(series, s => isEqual(s.selector, selector))

      // @todo when pie type, use selector to group and name points instead of series

      if (!seriesConfig) {
        seriesConfig = getNewSeries()
        series.push(seriesConfig)
      }

      const y = Number(point[metric])
      const pointConfig = {
        id: index,
        y: isNaN(y) ? null : y
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
    title: {
      text: null
    },
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
