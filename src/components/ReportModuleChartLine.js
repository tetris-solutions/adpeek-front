import React from 'react'
import Chart from './Highcharts'
import {reportToChartConfig} from '../functions/report-to-chart-config'
import chartType from '../propTypes/report-chart'

function ChartLine (props) {
  const config = reportToChartConfig('line', props)

  return (
    <Chart config={config}>
      <title>{props.name}</title>
      <credits enabled={false}/>
      <navigation>
        <button-options enabled={false}/>
      </navigation>
      <exporting filename={props.name} fallbackToExportServer={false}/>
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
