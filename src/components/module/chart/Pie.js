import React from 'react'
import Highcharts from '../../Highcharts'
import AsyncChart from './AsyncChart'

class ChartPie extends AsyncChart {
  static displayName = 'Pie'

  render () {
    const props = this.props.config

    return (
      <Highcharts config={this.state.config}>
        <title>{props.name}</title>
        <exporting
          sourceWidth={props.sourceWidth}
          sourceHeight={props.sourceHeight}
          filename={props.name}/>
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
