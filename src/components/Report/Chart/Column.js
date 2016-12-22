import React from 'react'
import Highcharts from '../../Highcharts'
import {reportToChartConfig} from '../../../functions/report-to-chart-config'
import chartType from '../../../propTypes/report-chart'

function ChartColumn (props) {
  const config = reportToChartConfig('column', props)

  return (
    <Highcharts config={config} zoomType='xy'>
      <title>{props.name}</title>
      <exporting
        sourceWidth={props.sourceWidth}
        sourceHeight={props.sourceHeight}
        filename={props.name}/>
    </Highcharts>
  )
}

ChartColumn.displayName = 'Column'
ChartColumn.propTypes = chartType

export default ChartColumn
