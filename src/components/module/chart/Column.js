import React from 'react'
import Highcharts from '../../Highcharts'
import AsyncChart from './AsyncChart'

class Column extends AsyncChart {
  static displayName = 'Column'

  render () {
    return (
      <Highcharts config={this.state.config} zoomType='xy'>
        <title>{this.props.name}</title>
        <exporting
          sourceWidth={this.props.sourceWidth}
          sourceHeight={this.props.sourceHeight}
          filename={this.props.name}/>
      </Highcharts>
    )
  }
}

export default Column
