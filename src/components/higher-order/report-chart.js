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
import omit from 'lodash/omit'

const {PropTypes} = React

export function reportChart (ChartComponent) {
  function ReportChart ({query: {metrics, dimensions}, result, entity, type}) {
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
      const includedDimensions = pick(row, dimensions)

      if (xAxisDimension !== 'date' && isString(row[xAxisDimension])) {
        categories.push(row[xAxisDimension])
      }

      forEach(metrics, (metric, yAxisIndex) => {
        const selector = assign({metric}, includedDimensions)

        let pointSeries = find(series, s => isEqual(s.selector, selector))

        if (!pointSeries) {
          const descriptors = map(selector, (val, key) => `${key}(${val})`)

          pointSeries = {
            type,
            id: join(descriptors, ':'),
            name: join(descriptors, ':'),
            selector,
            yAxis: yAxisIndex,
            data: []
          }

          if (includedDimensions.id !== undefined) {
            const refEntity = find(entity.list, {id: includedDimensions.id})

            if (refEntity) {
              const nameParts = map(omit(selector, 'id'),
                (val, key) => `${key}: ${val}`)

              nameParts.unshift(refEntity.name)

              pointSeries.name = join(nameParts, ' - ')
            }
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

    const config = {
      credits: {enabled: false},
      yAxis, xAxis: {},
      series
    }

    if (xAxisDimension === 'date') {
      config.xAxis.type = 'datetime'
    }

    if (categories.length) {
      config.xAxis.categories = uniq(categories)
    }

    return <ChartComponent config={config}/>
  }

  ReportChart.displayName = `Report(${ChartComponent.displayName})`
  ReportChart.propTypes = {
    type: PropTypes.string,
    result: PropTypes.array,
    query: PropTypes.shape({
      dimensions: PropTypes.array,
      metrics: PropTypes.array
    }),
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
