import React from 'react'
import AsyncChart from './AsyncChart'
import Highcharts from '../../Highcharts'

class ChartLine extends AsyncChart {
  static displayName = 'Line'

  render () {
    const props = this.props.config

    return (
      <Highcharts config={this.state.config} zoomType='xy'>
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
      </Highcharts>
    )
  }
}

export default ChartLine
