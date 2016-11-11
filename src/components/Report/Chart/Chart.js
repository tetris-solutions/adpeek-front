import csjs from 'csjs'
import floor from 'lodash/floor'
import React from 'react'
import reportEntityType from '../../../propTypes/report-entity'
import reportModuleType from '../../../propTypes/report-module'
import Column from './Column'
import Line from './Line'
import Pie from './Pie'
import Spinner from '../../Spinner'
import Table from './Table'
import Total from './Total'
import {styled} from '../../mixins/styled'

const style = csjs`
.wrap {
  overflow: auto;
  position: relative;
}
.wrap > div[data-highcharts-chart] {
  height: 100%
}
.spinner {
  position: absolute;
  bottom: 20px;
  right: 20px;
  width: 40px;
  height: 40px;
}`

const typeComponent = {
  line: Line,
  pie: Pie,
  column: Column,
  table: Table,
  total: Total
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

const ChartContainer = React.createClass({
  displayName: 'Chart',
  mixins: [styled(style)],
  propTypes: {
    height: PropTypes.number.isRequired,
    change: PropTypes.func
  },
  contextTypes: {
    messages: PropTypes.object,
    locales: PropTypes.string,
    module: reportModuleType.isRequired,
    entity: reportEntityType.isRequired,
    attributes: PropTypes.object.isRequired,
    reportParams: PropTypes.object.isRequired
  },
  getInitialState () {
    return {
      renderHiddenTable: false
    }
  },
  renderAsTable () {
    const unlock = () => this.setState({renderHiddenTable: false})

    return new Promise(resolve => this.setState({renderHiddenTable: true},
      function resolveThenUnlock () {
        resolve()
        setTimeout(unlock, 300)
      }))
  },
  componentDidMount () {
    this.refs.interface.renderAsTable = this.renderAsTable
  },
  shouldComponentUpdate (nextProps, nextState, nextContext) {
    const newModule = nextContext.module
    const oldModule = this.context.module

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
    const {module, locales, reportParams, entity, attributes} = this.context
    const {height, change} = this.props
    const Chart = typeComponent[module.type]

    const config = {
      change,
      locales: locales,
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

export default ChartContainer
