import React from 'react'
import Chart from './Highcharts'
import {reportToChartConfig} from '../functions/report-to-chart-config'
import chartType from '../propTypes/report-chart'

function ChartColumn (props) {
  const config = reportToChartConfig('column', props)

  return (
    <Chart config={config}>
      <title>{props.name}</title>
      <credits enabled={false}/>
      <navigation>
        <button-options enabled={false}/>
      </navigation>
      <exporting filename={props.name} fallbackToExportServer={false}/>
    </Chart>
  )
}

ChartColumn.displayName = 'Column'
ChartColumn.propTypes = chartType

export default ChartColumn
