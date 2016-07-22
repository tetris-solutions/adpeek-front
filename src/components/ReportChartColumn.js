import React from 'react'
import Chart from './Highcharts'
import {reportToChartConfig} from '../functions/report-to-chart-config'
import chartType from '../propTypes/report-chart'

function ChartColumn (props) {
  const config = reportToChartConfig('column', props)

  return <Chart config={config}/>
}

ChartColumn.displayName = 'Column'
ChartColumn.propTypes = chartType

export default ChartColumn
