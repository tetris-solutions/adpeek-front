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

export function reportToChartConfig (type, {query: {metrics, dimensions}, result, entity, attributes}) {
  const yAxis = map(metrics, (metric, index) => ({
    title: {
      text: metric
    },
    opposite: index % 2 !== 0
  }))

  const categories = []
  const xAxisDimension = includes(dimensions, 'date')
    ? 'date'
    : dimensions[0]

  const isDateBased = xAxisDimension === 'date'

  if (isDateBased) {
    result = sortBy(result, xAxisDimension)
  }

  dimensions = without(dimensions, xAxisDimension)

  const series = []

  function rowIterator (point, index) {
    const pointDimensions = pick(point, dimensions)
    const getRefEntity = () => find(entity.list, {id: point.id})
    let referenceEntity

    if (xAxisDimension === 'id') {
      referenceEntity = getRefEntity()

      categories.push(referenceEntity
        ? referenceEntity.name
        : point.id
      )
    } else if (!isDateBased && isString(point[xAxisDimension])) {
      categories.push(point[xAxisDimension])
    }

    function formatAttrName (val, key) {
      if (key === 'metric') {
        return attributes[val].name
      }

      const name = attributes[key] ? attributes[key].name : key

      return `${name}: ${val}`
    }

    function metricIterator (metric, yAxisIndex) {
      const selector = assign({metric}, pointDimensions)

      let seriesConfig = find(series, s => isEqual(s.selector, selector))

      if (!seriesConfig) {
        const descriptors = map(selector,
          (val, key) => `${key}(${val})`)

        seriesConfig = {
          type,
          id: join(descriptors, ':'),
          name: join(descriptors, ':'),
          selector,
          yAxis: yAxisIndex,
          data: []
        }

        if (point.id !== undefined) {
          referenceEntity = referenceEntity || getRefEntity()

          if (referenceEntity) {
            const nameParts = map(omit(selector, 'id'), formatAttrName)

            nameParts.unshift(referenceEntity.name)

            seriesConfig.name = join(nameParts, ', ')
          }
        }

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
