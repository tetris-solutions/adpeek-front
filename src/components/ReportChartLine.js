import React from 'react'
import {reportChart} from './higher-order/report-chart'

const {PropTypes} = React
const preStyle = {
  maxHeight: 300,
  fontSize: 9,
  fontWeight: 'bold',
  overflowY: 'auto'
}

function ChartLine ({config}) {
  return (
    <pre style={preStyle}>
      {JSON.stringify(config, null, 2)}
    </pre>
  )
}

ChartLine.displayName = 'Chart-Line'
ChartLine.propTypes = {
  config: PropTypes.object
}

export default reportChart(ChartLine)
