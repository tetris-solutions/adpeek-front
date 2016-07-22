import React from 'react'
import Chart from './Highcharts'
import {reportToChartConfig} from '../functions/report-to-chart-config'
import chartType from '../propTypes/report-chart'

function ChartPie (props) {
  const config = reportToChartConfig('pie', props)

  return <Chart config={config}/>
}

ChartPie.displayName = 'Pie'
ChartPie.propTypes = chartType

export default ChartPie
