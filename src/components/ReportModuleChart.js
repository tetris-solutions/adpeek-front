import csjs from 'csjs'
import floor from 'lodash/floor'
import React from 'react'

import reportEntityType from '../propTypes/report-entity'
import reportMetaDataType from '../propTypes/report-meta-data'
import reportModuleType from '../propTypes/report-module'
import reportParamsType from '../propTypes/report-params'
import Column from './ReportModuleChartColumn'
import Line from './ReportModuleChartLine'
import Pie from './ReportModuleChartPie'
import Spinner from './Spinner'
import Table from './ReportModuleTable'
import {styled} from './mixins/styled'

const style = csjs`
.wrap {
  overflow: auto;
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

const A4Ratio = 674 / 1032

const ReportChart = React.createClass({
  displayName: 'Report-Chart',
  mixins: [styled(style)],
  propTypes: {
    save: PropTypes.func,
    height: PropTypes.number.isRequired,
    reportParams: reportParamsType,
    metaData: reportMetaDataType.isRequired,
    module: reportModuleType,
    entity: reportEntityType,
    dispatch: PropTypes.func
  },
  contextTypes: {
    messages: PropTypes.object,
    locales: PropTypes.string
  },
  getDefaultProps () {
    return {
      metaData: {
        attributes: {}
      }
    }
  },
  getInitialState () {
    return {
      renderHiddenTable: false
    }
  },
  renderAsTable () {
    const unlock = () => this.setState({renderHiddenTable: false})

    return new Promise(resolve =>
      this.setState({renderHiddenTable: true}, () => {
        resolve()
        setTimeout(unlock, 300)
      }))
  },
  componentDidMount () {
    this.refs.interface.renderAsTable = this.renderAsTable
  },
  shouldComponentUpdate (nextProps, nextState) {
    const newModule = nextProps.module
    const oldModule = this.props.module

    return (
      nextState.renderHiddenTable !== this.state.renderHiddenTable ||
      nextProps.height !== this.props.height ||
      newModule.sort !== oldModule.sort ||
      newModule.limit !== oldModule.limit ||
      newModule.cols !== oldModule.cols ||
      newModule.isLoading !== oldModule.isLoading ||
      newModule.result !== oldModule.result ||
      newModule.name !== oldModule.name ||
      newModule.type !== oldModule.type
    )
  },
  render () {
    const {renderHiddenTable} = this.state
    const {save, height, reportParams, module, entity, metaData: {attributes}} = this.props
    const Chart = typeComponent[module.type]
    const config = {
      locales: this.context.locales,
      save: save,
      sort: module.sort,
      limit: module.limit,
      isLoading: module.isLoading,
      reportParams: reportParams,
      sourceWidth: 1200,
      sourceHeight: floor(1200 * A4Ratio),
      name: module.name,
      messages: this.context.messages,
      attributes: attributes,
      entity: entity,
      result: module.result || emptyResult,
      query: module.query || emptyQuery
    }

    return (
      <div className={`${style.wrap}`} style={{height}}>
        <Chart {...config}/>
        <div ref='interface' style={{display: 'none'}} data-interface>
          {renderHiddenTable
            ? <Table {...config}/>
            : null}
        </div>
        {module.isLoading && <ChartSpinner/>}
      </div>
    )
  }
})

export default ReportChart
