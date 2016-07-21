import React from 'react'
import {reportChart} from './higher-order/report-chart'
import Chart from './Highcharts'

const {PropTypes} = React

function ChartColumn ({config}) {
  return <Chart config={config}/>
}

ChartColumn.displayName = 'Chart-Column'
ChartColumn.propTypes = {
  config: PropTypes.object
}

export default reportChart(ChartColumn)
