import csjs from 'csjs'
import React from 'react'
import reportEntityType from '../../../propTypes/report-entity'
import reportMetaDataType from '../../../propTypes/report-meta-data'
import reportModuleType from '../../../propTypes/report-module'
import reportParamsType from '../../../propTypes/report-params'
import Chart from '../Chart/Container'
import {styled} from '../../mixins/styled'

const style = csjs`
.card, .content, .content > div {
  width: 100%;
}`

const {PropTypes} = React

const ModuleCard = React.createClass({
  displayName: 'Module-Card',
  mixins: [styled(style)],
  propTypes: {
    children: PropTypes.node.isRequired,
    metaData: reportMetaDataType.isRequired,
    module: reportModuleType.isRequired,
    entity: reportEntityType.isRequired,
    reportParams: reportParamsType.isRequired
  },
  componentWillReceiveProps ({module: {cols, rows}}) {
    const {module} = this.props

    this.repaintChart = cols !== module.cols || rows !== module.rows
  },
  componentDidUpdate () {
    const resizedChart = this.repaintChart
      ? this.refs.chartWrapper.querySelector('div[data-highcharts-chart]')
      : null

    if (resizedChart) {
      resizedChart.HCharts.reflow()
    }
  },
  render () {
    const {children, module, metaData, entity, reportParams} = this.props

    return (
      <div className={`mdl-card mdl-shadow--2dp ${style.card}`}>
        <div ref='chartWrapper' className={`mdl-card__title mdl-card--expand ${style.content}`}>
          <Chart
            height={module.rows * 100}
            metaData={metaData}
            module={module}
            entity={entity}
            reportParams={reportParams}/>
        </div>
        {children}
      </div>
    )
  }
})

export default ModuleCard
