import React from 'react'
import Chart from './Highcharts'
import {reportToChartConfig} from '../functions/report-to-chart-config'
import chartType from '../propTypes/report-chart'

function ChartPie (props) {
  const config = reportToChartConfig('pie', props)

  return (
    <Chart config={config}>
      <title>{props.name}</title>
      <credits enabled={false}/>
      <plot-options>
        <pie>
          <data-labels enabled={false}/>
        </pie>
      </plot-options>
    </Chart>
  )
}

ChartPie.displayName = 'Pie'
ChartPie.propTypes = chartType

export default ChartPie
