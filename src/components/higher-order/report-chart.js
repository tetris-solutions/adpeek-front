import React from 'react'
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

const {PropTypes} = React

export function reportChart (ChartComponent) {
  function ReportChart ({dimensions, result, metrics, entity, type}) {
    // const yAxis = {}
    const categories = []
    const xAxisDimension = includes(dimensions, 'date')
      ? 'date'
      : dimensions[0]

    if (xAxisDimension === 'date') {
      result = sortBy(result, xAxisDimension)
      dimensions = without(dimensions, xAxisDimension)
    }

    const series = [{
      id: 'id(123):network(search):metric(click)',
      selector: {
        id: 123,
        network: 'search',
        metric: 'click'
      },
      data: [{
        id: 0,
        y: 10
      }]
    }]

    series.length = 0

    forEach(result, (row, index) => {
      const groupBy = pick(row, dimensions)

      if (xAxisDimension !== 'date' && isString(row[xAxisDimension])) {
        categories.push(row[xAxisDimension])
      }

      forEach(metrics, metric => {
        const selector = assign({metric}, groupBy)

        let pointSeries = find(series, s => isEqual(s.selector, selector))

        if (!pointSeries) {
          const descriptors = map(selector, (val, key) => `${key}(${val})`)

          pointSeries = {
            id: join(descriptors, ':'),
            selector,
            data: []
          }

          series.push(pointSeries)
        }

        const y = Number(row[metric])
        const point = {
          id: index,
          y: isNaN(y) ? null : y
        }

        if (xAxisDimension === 'date') {
          point.x = new Date(row.date).getTime()
        }

        pointSeries.data.push(point)
      })
    })

    const config = {xAxis: {}, series}

    if (categories.length) {
      config.xAxis.categories = uniq(categories)
    }

    return <ChartComponent config={config}/>
  }

  ReportChart.displayName = `Report(${ChartComponent.displayName})`
  ReportChart.propTypes = {
    type: PropTypes.string,
    dimensions: PropTypes.array,
    result: PropTypes.array,
    metrics: PropTypes.array,
    entity: PropTypes.shape({
      id: PropTypes.string,
      name: PropTypes.string,
      list: PropTypes.arrayOf(PropTypes.shape({
        id: PropTypes.string,
        name: PropTypes.string
      }))
    })
  }

  return ReportChart
}
