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
import without from 'lodash/without'
import {isWrapDate} from './is-wrap-date'
import {getEmptyModuleMessage} from './get-empty-module-message'
import {createTask} from './queue-hard-lift'
import orderBy from 'lodash/orderBy'
import {prettyNumber} from './pretty-number'
import set from 'lodash/set'

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

  if (isWrapDate(first)) {
    return types.datetime
  }

  return types.linear
}

function plainMessage () {
  /**
   *
   * @type {Highcharts.Chart}
   */
  const chart = this

  const label = chart._label_ = chart._label_ || chart.renderer.label().add()

  label.textSetter(chart.userOptions.labelMessage)

  const labelBox = label.getBBox()
  const x = chart.plotLeft + (chart.plotWidth * 0.5) - (labelBox.width * 0.5)
  const y = chart.plotTop + (chart.plotHeight * 0.5) - (labelBox.height * 0.5)

  label.ySetter(y)
  label.xSetter(x)
  label.css({fontStyle: 'italic', fontSize: '12pt'})
}

const emptyResultChart = labelMessage => ({
  labelMessage,
  chart: {
    events: {
      load: plainMessage,
      redraw: plainMessage
    },
    title: {
      style: {
        color: '#8a8a8a'
      }
    }
  }
})

function getAccountSelector (id) {
  if (!includes(id, ':')) return id

  const [tetris_account, ad_account] = id.split(':').slice(0, 2)

  return {tetris_account, ad_account}
}

function mountAnalyticsCampaign (id) {
  const name = id.split(':').slice(2).join(':')

  return {id: name, name}
}

const comparable = attr => x => {
  const value = get(x, `__row__.${attr}`)

  if (isWrapDate(value)) {
    return value.date
  }

  switch (value) {
    case '--':
    case '---':
      return -Infinity
    default:
      return value
  }
}

const readType = attr => attr.type === 'special' && attr.is_percentage
  ? 'percentage'
  : attr.type

function simplePointFormatter () {
  return this.text
}

function yAxisLabelFormatter () {
  const {chart, axis} = this

  return prettyNumber(
    this.value,
    readType(chart.options.attributes[axis.options.metric]),
    chart.options.locales
  )
}

function pointFormatter () {
  const {series: {chart: {options}}} = this
  const attribute = options.attributes[this.options.metric]
  const value = prettyNumber(this.y, readType(attribute), options.locales)

  return `
        <span style="color: ${this.color}">${this.series.name}:</span>
        <b>${value}</b>
        ${this.options.raw ? `<em>${this.options.raw}</em>` : ''}
        <br/>`
}

export const reportToChartConfig = createTask((module) => {
  const emptyModuleLabel = getEmptyModuleMessage(module)

  if (emptyModuleLabel) {
    return emptyResultChart(emptyModuleLabel)
  }

  const {comments, query, entity, attributes, type} = module
  let {result} = module
  const {metrics} = query
  let {dimensions} = query

  const getAttributeName = attr => get(attributes, [attr, 'name'], attr)
  const getSeriesAttributeName = (val, key) => key === 'metric'
    ? getAttributeName(val)
    : `${getAttributeName(key)}: ${val}`

  function createNewSeries (referenceEntity, seriesSignature, yAxisIndex) {
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

  const yAxis = map(metrics, (metric, index) => ({
    metric,
    title: {
      text: getAttributeName(metric)
    },
    labels: {
      formatter: yAxisLabelFormatter
    },
    opposite: index % 2 !== 0
  }))

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

  if ((type === 'pie' || type === 'column') && module.limit) {
    result = result.slice(0, module.limit)
  }

  dimensions = without(dimensions, xAxisDimension)

  const series = []
  const getEntityById = memoize(id => {
    if (!id) return mockEntity

    const {accounts, report: {platform: reportPlatform}} = module
    const platform = reportPlatform || get(find(accounts, getAccountSelector(id)), 'platform')

    if (platform === 'analytics') {
      return reportPlatform ? {id, name: id} : mountAnalyticsCampaign(id)
    }

    return find(entity.list, {id}) || mockEntity
  })

  function walk (rows, xValue) {
    function rowIteratee (row, index) {
      const rowDimensions = pick(row, dimensions)
      const referenceEntity = getEntityById(row.id)

      function metricIteratee (metric, yAxisIndex) {
        const seriesSignature = assign(
          size(metrics) > 1 || isEmpty(rowDimensions) ? {metric} : {},
          rowDimensions
        )

        let seriesConfig = type === 'pie'
          ? series[0] // pie always consists of a single series
          : find(series, s => isEqual(s.seriesSignature, seriesSignature))

        if (!seriesConfig) {
          seriesConfig = createNewSeries(referenceEntity, seriesSignature, yAxisIndex)
          series.push(seriesConfig)
        }

        const isSpecialPoint = isObject(row[metric]) && row[metric].value !== undefined

        const point = {
          metric,
          id: row._index_,
          __row__: row
        }

        if (isSpecialPoint) {
          point.y = row[metric].value
          point.raw = row[metric].raw
          point.marker = {
            enabled: true,
            fillColor: '#414141',
            symbol: 'circle'
          }
        } else {
          const value = Number(row[metric])
          point.y = isNaN(value) ? null : value
        }

        if (type === 'pie') {
          point.name = isIdBased
            ? referenceEntity.name
            : row[xAxisDimension]
        }

        if (isWrapDate(row[xAxisDimension])) {
          point.x = row[xAxisDimension].date.getTime()
        }

        seriesConfig.data.push(point)
      }

      forEach(metrics, metricIteratee)
    }

    forEach(rows, rowIteratee)
  }

  const grouped = {}

  forEach(result, (row, _index_) => {
    const x = row[xAxisDimension]

    if (!grouped[x]) {
      grouped[x] = []
    }

    grouped[x].push(assign({_index_}, row))
  })

  forEach(grouped, walk)

  const categories = []

  forEach(series, currentSeries => {
    if (xAxis.sortable) {
      currentSeries.data = orderBy(currentSeries.data, comparable(xAxisDimension))
    } else {
      currentSeries.data = orderBy(currentSeries.data, comparable(metrics[0]), 'desc')
    }

    forEach(currentSeries.data, point => {
      const {__row__: row, id: index} = point

      if (isIdBased) {
        categories[index] = getEntityById(row.id).name
      } else if (isString(row[xAxisDimension])) {
        categories[index] = String(row[xAxisDimension])
      }

      delete point.__row__
    })
  })

  if (type === 'line' && xAxisDimension === 'date') {
    const days = groupBy(comments, 'date')

    series.push({
      id: 'comments',
      type: 'flags',
      name: 'Comments',
      shape: 'circlepin',
      showInLegend: false,
      tooltip: {
        pointFormatter: simplePointFormatter
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
    locales: module.locales,
    attributes: attributes,
    chart: {
      events: {
        load: null,
        redraw: null
      }
    },
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

  set(config, ['plotOptions', 'series', 'tooltip', 'pointFormatter'], pointFormatter)

  return config
})
