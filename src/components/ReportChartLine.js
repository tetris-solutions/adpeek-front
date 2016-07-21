import React from 'react'
import {reportChart} from './higher-order/report-chart'
import Chart from './Highcharts'

const {PropTypes} = React

function ChartLine ({config}) {
  return <Chart config={config}/>
}

ChartLine.displayName = 'Chart-Line'
ChartLine.propTypes = {
  config: PropTypes.object
}

export default reportChart(ChartLine)
