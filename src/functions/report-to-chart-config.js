import assign from 'lodash/assign'
import groupBy from 'lodash/groupBy'
import find from 'lodash/find'
import forEach from 'lodash/forEach'
import get from 'lodash/get'
import includes from 'lodash/includes'
import isEmpty from 'lodash/isEmpty'
import isEqual from 'lodash/isEqual'
import isString from 'lodash/isString'
import join from 'lodash/join'
import map from 'lodash/map'
import negate from 'lodash/negate'
import omit from 'lodash/omit'
import pick from 'lodash/pick'
import orderBy from 'lodash/orderBy'
import without from 'lodash/without'
import {prettyNumber} from './pretty-number'
import set from 'lodash/set'
import isDate from 'lodash/isDate'

const isEntityId = d => d === 'id' || d === 'name'
const notEntityId = negate(isEntityId)
const cropped = comment => comment.length > 100
  ? comment.substr(0, 100) + '...'
  : comment

const types = {
  linear: {
    type: 'linear'
  },
  datetime: {
    type: 'datetime',
    sortable: true
  },
  time: {
    type: 'datetime',
    format: '%H:%M',
    sortable: true
  }
}

function detectXAxis (result, xAxisDimensions) {
  switch (xAxisDimensions) {
    case 'hourofday':
    case 'hourly_stats_aggregated_by_advertiser_time_zone':
    case 'hourly_stats_aggregated_by_audience_time_zone':
      return types.time
  }

  /**
   * first x axis point
   * @type {String}
   */
  const first = get(result, [0, xAxisDimensions])

  if (isDate(first)) {
    return types.datetime
  }

  return types.linear
}

const emptyResultChart = ({isLoading, messages: {loadingReport, emptyReportResult}}) => ({
  chart: {
    events: {
      load () {
        const x = (this.chartWidth / 2) - 50
        const y = (this.chartHeight / 2) - 20

        this.renderer
          .label(
            isLoading ? loadingReport : emptyReportResult,
            x,
            y
          )
          .css({fontStyle: 'italic', fontSize: '12pt'})
          .add()
      }
    },
    title: {
      style: {
        color: '#8a8a8a'
      }
    }
  }
})

export function reportToChartConfig (type, props) {
  const {comments, query, entity, attributes} = props
  const {metrics} = query
  let {result} = props
  let {dimensions} = query

  if (isEmpty(result)) {
    return emptyResultChart(props)
  }

  const getAttributeName = attr => get(attributes, [attr, 'name'], attr)
  const getSeriesAttributeName = (val, key) => key === 'metric'
    ? getAttributeName(val)
    : `${getAttributeName(key)}: ${val}`

  const yAxis = map(metrics, (metric, index) => ({
    title: {
      text: getAttributeName(metric)
    },
    labels: {
      formatter () {
        const attribute = attributes[metric]
        return prettyNumber(this.value, attribute.type, props.locales)
      }
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
    result = orderBy(result, xAxisDimension)
  } else {
    result = orderBy(result, metrics[0], 'desc')
  }

  if ((type === 'pie' || type === 'column') && props.limit) {
    result = result.slice(0, props.limit)
  }

  dimensions = without(dimensions, xAxisDimension)

  const series = []

  function pointIterator (point, index) {
    const pointDimensions = pick(point, dimensions)

    let referenceEntity

    if (point.id !== undefined) {
      referenceEntity = find(entity.list, {id: point.id})
      if (!referenceEntity) return
    }

    if (isIdBased) {
      categories.push(referenceEntity.name)
    } else if (
      xAxisDimension === 'qualityscore' ||
      isString(point[xAxisDimension])
    ) {
      categories.push(String(point[xAxisDimension]))
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
        metric,
        id: index,
        // @todo maybe cast string values somehow?
        y: isNaN(y) ? null : y
      }

      if (type === 'pie') {
        pointConfig.name = isIdBased
          ? referenceEntity.name
          : point[xAxisDimension]
      }

      if (isDate(point[xAxisDimension])) {
        pointConfig.x = point[xAxisDimension]
      }

      seriesConfig.data.push(pointConfig)
    }

    forEach(metrics, metricIterator)
  }

  forEach(result, pointIterator)

  if (type === 'line' && xAxisDimension === 'date') {
    const days = groupBy(comments, 'date')

    series.unshift({
      id: 'comments',
      type: 'flags',
      name: 'Comments',
      shape: 'circlepin',
      showInLegend: false,
      tooltip: {
        pointFormatter () {
          return this.text
        }
      },
      data: map(days, (groupOfComments, date) => {
        const [year, month, day] = date.split('-').map(Number)

        return {
          id: date,
          x: Date.UTC(year, month - 1, day),
          comments: groupOfComments,
          title: String(groupOfComments.length),
          text: join(map(groupOfComments, ({user, body}) => `<strong>${user.name}</strong>: ${cropped(body)}`), '<br/>')
        }
      })
    })
  }

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
    config.xAxis.categories = categories
  }

  function pointFormatter () {
    const attribute = attributes[this.options.metric]
    const value = prettyNumber(this.y, attribute.type, props.locales)
    return `<span style="color: ${this.color}">${attribute.name}:</span> <b>${value}</b><br/>`
  }

  set(config, ['plotOptions', 'series', 'tooltip', 'pointFormatter'], pointFormatter)

  return config
}
