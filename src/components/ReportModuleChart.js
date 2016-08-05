import React from 'react'
import {branch} from 'baobab-react/higher-order'
import reportParamsType from '../propTypes/report-params'
import reportModuleType from '../propTypes/report-module'
import reportEntityType from '../propTypes/report-entity'
import Line from './ReportModuleChartLine'
import Column from './ReportModuleChartColumn'
import Pie from './ReportModuleChartPie'
import Table from './ReportModuleTable'
import Spinner from './Spinner'
import {styled} from './mixins/styled'
import csjs from 'csjs'

const style = csjs`
.wrap {
  overflow: hidden
}
.wrap > div[data-highcharts-chart] {
  height: 100%
}
.spinner {
  position: absolute;
  bottom: 1em;
  right: 1em;
  width: 40px;
  height: 40px;
}`

const typeComponent = {
  line: Line,
  pie: Pie,
  column: Column,
  table: Table
}
const {PropTypes} = React

const ChartSpinner = () => (
  <div className={`${style.spinner}`}>
    <Spinner/>
  </div>
)

const emptyQuery = {
  metrics: [],
  dimensions: []
}
const emptyResult = []

const ReportChart = React.createClass({
  displayName: 'Report-Chart',
  mixins: [styled(style)],
  propTypes: {
    reportParams: reportParamsType,
    module: reportModuleType,
    entity: reportEntityType,
    query: PropTypes.object,
    dispatch: PropTypes.func,
    metaData: PropTypes.shape({
      attributes: PropTypes.object
    })
  },
  getDefaultProps () {
    return {
      metaData: {
        attributes: {}
      }
    }
  },
  shouldComponentUpdate (nextProps) {
    const newModule = nextProps.module
    const oldModule = this.props.module

    return (
      newModule.isLoading !== oldModule.isLoading ||
      newModule.result !== oldModule.result
    )
  },
  render () {
    const {module, entity, metaData: {attributes}} = this.props
    const Chart = typeComponent[module.type]

    return (
      <div className={`${style.wrap}`} style={{height: module.rows * 100}}>
        <Chart
          name={module.name}
          attributes={attributes}
          entity={entity}
          result={module.result || emptyResult}
          query={module.query || emptyQuery}/>

        {module.isLoading && <ChartSpinner/>}
      </div>
    )
  }
})

export default branch(({module: {id}, reportParams, entity}) => ({
  metaData: ['reports', 'metaData', reportParams.platform, entity.id],
  result: ['reports', 'modules', id, 'data'],
  query: ['reports', 'modules', id, 'query']
}), ReportChart)
