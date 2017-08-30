import React from 'react'
import AsyncChart from './AsyncChart'
import Highcharts from '../../Highcharts'

class ChartLine extends AsyncChart {
  static displayName = 'Line'

  render () {
    const module = this.props.config
    const chartConfig = this.state.config

    return (
      <Highcharts config={chartConfig} zoomType='xy'>
        <title>{module.name}</title>
        <exporting
          sourceWidth={module.sourceWidth}
          sourceHeight={module.sourceHeight}
          filename={module.name}/>
        <plot-options>
          <line>
            <marker enabled={false}/>
          </line>
        </plot-options>
        <tooltip shared/>
      </Highcharts>
    )
  }
}

export default ChartLine
