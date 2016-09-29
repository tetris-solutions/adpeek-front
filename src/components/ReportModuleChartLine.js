import React from 'react'

import chartType from '../propTypes/report-chart'
import Chart from './Highcharts'
import {reportToChartConfig} from '../functions/report-to-chart-config'

function ChartLine (props) {
  const config = reportToChartConfig('line', props)

  return (
    <Chart config={config} zoomType='x'>
      <title>{props.name}</title>
      <exporting
        sourceWidth={props.sourceWidth}
        sourceHeight={props.sourceHeight}
        filename={props.name}/>
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
