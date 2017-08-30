import React from 'react'
import Highcharts from '../../Highcharts'
import AsyncChart from './AsyncChart'

class Column extends AsyncChart {
  static displayName = 'Column'

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
      </Highcharts>
    )
  }
}

export default Column
