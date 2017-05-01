import assign from 'lodash/assign'
import groupBy from 'lodash/groupBy'
import find from 'lodash/find'
import forEach from 'lodash/forEach'
import get from 'lodash/get'
import size from 'lodash/size'
import memoize from 'lodash/memoize'
import includes from 'lodash/includes'
import isObject from 'lodash/isPlainObject'
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
const cropped = comment => size(comment) > 100
  ? comment.substr(0, 100) + '...'
  : comment

const mockEntity = {name: '---'}
const types = {
  linear: {
    type: 'linear'
  },
  datetime: {
    type: 'datetime',
    headerFormat: '%a %d, %B, %Y',
    sortable: true
  },
  time: {
    type: 'datetime',
    headerFormat: '%H:%M',
    labelFormat: '%H:%M',
    sortable: true
  },
  dayofweek: {
    type: 'datetime',
    headerFormat: '%A',
    labelFormat: '%A',
    sortable: true
  },
  year: {
    type: 'datetime',
    headerFormat: '%Y',
    labelFormat: '%Y',
    sortable: true
  },
  week: {
    type: 'datetime',
    headerFormat: '%W - %d, %B, %Y',
    labelFormat: '%d/%B',
    sortable: true
  },
  monthofyear: {
    type: 'datetime',
    headerFormat: '%B',
    labelFormat: '%B',
    sortable: true
  },
  month: {
    type: 'datetime',
    headerFormat: '%B, %Y',
    labelFormat: '%b, %Y',
    sortable: true
  },
  quarter: {
    type: 'datetime',
    headerFormat: '%B, %Y',
    labelFormat: '%b, %Y',
    sortable: true
  }
}

types.yearmonth = types.month
types.isoyearisoweek = types.week
types.day_of_week = types.dayofweekname = types.dayofweek
types.month_of_year = types.monthofyear

function detectXAxis (result, xAxisDimensions) {
  switch (xAxisDimensions) {
    case 'hour':
    case 'hourofday':
    case 'hourly_stats_aggregated_by_advertiser_time_zone':
    case 'hourly_stats_aggregated_by_audience_time_zone':
      return types.time
    case 'quarter':
    case 'day_of_week':
    case 'dayofweekname':
    case 'dayofweek':
    case 'month':
    case 'yearmonth':
    case 'month_of_year':
    case 'monthofyear':
    case 'isoyearisoweek':
    case 'week':
    case 'year':
      return types[xAxisDimensions]
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

const readType = attr => attr.type === 'special' && attr.is_percentage
  ? 'percentage'
  : attr.type

function getAccountSelector (id) {
  if (!includes(id, ':')) return id

  const [tetris_account, ad_account] = id.split(':').slice(0, 2)

  return {tetris_account, ad_account}
}

function mountAnalyticsCampaign (id) {
  const name = id.split(':').slice(2).join(':')

  return {id: name, name}
}

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
        return prettyNumber(
          this.value,
          readType(attributes[metric]),
          props.locales
        )
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
  const getEntityById = memoize(id => {
    const {accounts, report: {platform: reportPlatform}} = props
    const platform = reportPlatform || get(find(accounts, getAccountSelector(id)), 'platform')

    if (platform === 'analytics') {
      return reportPlatform ? {id, name: id} : mountAnalyticsCampaign(id)
    }

    return find(entity.list, {id}) || mockEntity
  })

  function walk (points, xValue) {
    const firstPoint = points[0]

    if (isIdBased) {
      categories.push(getEntityById(firstPoint.id).name)
    } else if (
      xAxisDimension === 'qualityscore' ||
      isString(firstPoint[xAxisDimension])
    ) {
      categories.push(String(firstPoint[xAxisDimension]))
    }

    function pointIterator (point, index) {
      const pointDimensions = pick(point, dimensions)
      const referenceEntity = getEntityById(point.id)

      function metricIterator (metric, yAxisIndex) {
        const seriesSignature = assign(
          size(metrics) > 1 || isEmpty(pointDimensions) ? {metric} : {},
          pointDimensions
        )

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

          if (!isEmpty(nameParts)) {
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

        const isSpecialPoint = isObject(point[metric]) && point[metric].value !== undefined

        const pointConfig = {
          metric,
          id: index
        }

        if (isSpecialPoint) {
          pointConfig.y = point[metric].value
          pointConfig.raw = point[metric].raw
          pointConfig.marker = {
            enabled: true,
            fillColor: '#414141',
            symbol: 'circle'
          }
        } else {
          const value = Number(point[metric])
          pointConfig.y = isNaN(value) ? null : value
        }

        if (type === 'pie') {
          pointConfig.name = isIdBased
            ? referenceEntity.name
            : point[xAxisDimension]
        }

        if (isDate(point[xAxisDimension])) {
          pointConfig.x = point[xAxisDimension].getTime()
        }

        seriesConfig.data.push(pointConfig)
      }

      forEach(metrics, metricIterator)
    }

    forEach(points, pointIterator)
  }

  forEach(groupBy(result, xAxisDimension), walk)

  if (type === 'line' && xAxisDimension === 'date') {
    const days = groupBy(comments, 'date')

    series.push({
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
          title: String(size(groupOfComments)),
          text: join(map(groupOfComments, ({user, body}) => `<strong>${user.name}</strong>: ${cropped(body)}`), '<br/>')
        }
      })
    })
  }

  const config = {
    yAxis,
    tooltip: {
      useHTML: true
    },
    xAxis: {
      type: xAxis.type
    },
    series
  }

  if (xAxis.headerFormat) {
    config.tooltip.headerFormat = `<b>{point.x:${xAxis.headerFormat}}</b><br/>`
  }

  if (xAxis.labelFormat) {
    config.xAxis.labels = {
      format: `{value:${xAxis.labelFormat}}`
    }
  }

  if (xAxisDimension) {
    config.xAxis.title = {
      text: getAttributeName(xAxisDimension),
      align: 'low'
    }
  }

  if (!isEmpty(categories)) {
    config.xAxis.categories = categories
  }

  function pointFormatter () {
    const attribute = attributes[this.options.metric]
    const value = prettyNumber(this.y, readType(attribute), props.locales)

    return `
        <span style="color: ${this.color}">${this.series.name}:</span>
        <b>${value}</b>
        ${this.options.raw ? `<em>${this.options.raw}</em>` : ''}
        <br/>`
  }

  set(config, ['plotOptions', 'series', 'tooltip', 'pointFormatter'], pointFormatter)

  return config
}
