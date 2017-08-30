import React from 'react'
import Highcharts from '../../Highcharts'
import AsyncChart from './AsyncChart'

class ChartPie extends AsyncChart {
  static displayName = 'Pie'

  render () {
    const module = this.props.config
    const chartConfig = this.state.config

    return (
      <Highcharts config={chartConfig}>
        <title>{module.name}</title>
        <exporting
          sourceWidth={module.sourceWidth}
          sourceHeight={module.sourceHeight}
          filename={module.name}/>
        <plot-options>
          <pie allowPointSelect showInLegend>
            <data-labels enabled={false}/>
          </pie>
        </plot-options>
      </Highcharts>
    )
  }
}

export default ChartPie
