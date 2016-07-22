import React from 'react'
import Chart from './Highcharts'
import {reportToChartConfig} from '../functions/report-to-chart-config'
import chartType from '../propTypes/report-chart'

function ChartLine (props) {
  const config = reportToChartConfig('line', props)

  return (
    <Chart config={config}>
      <credits enabled={false}/>

      <plot-options>
        <line>
          <marker enabled={false}/>
        </line>
      </plot-options>

      <tooltip shared/>
    </Chart>
  )
}

ChartLine.displayName = 'Line'
ChartLine.propTypes = chartType

export default ChartLine
