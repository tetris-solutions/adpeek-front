import React from 'react'
import {reportChart} from './higher-order/report-chart'
import Chart from './Highcharts'

const {PropTypes} = React

function ChartPie ({config}) {
  return <Chart config={config}/>
}

ChartPie.displayName = 'Chart-Pie'
ChartPie.propTypes = {
  config: PropTypes.object
}

export default reportChart(ChartPie)
