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
  height: 100%;
}
.wrap > div[data-highcharts-chart] {
  height: 100%
}
.spinner {
  position: absolute;
  bottom: 20px;
  right: 20px;
}
.hidden {
  display: none
}`

const typeComponent = {
  line: Line,
  pie: Pie,
  column: Column,
  table: Table,
  total: Total
}
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
    change: React.PropTypes.func
  },
  contextTypes: {
    messages: React.PropTypes.object,
    locales: React.PropTypes.string,
    module: reportModuleType.isRequired,
    entity: reportEntityType.isRequired,
    attributes: React.PropTypes.object.isRequired,
    reportParams: React.PropTypes.object.isRequired
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
      newModule.comments !== oldModule.comments ||
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
    const {change} = this.props
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
      comments: module.comments || emptyResult,
      query: module.query || emptyQuery
    }

    return (
      <div>
        <div className={`${style.wrap}`}>
          <Chart {...config}/>
          <div ref='interface' className={`${style.hidden}`} data-interface>
            {renderHiddenTable
              ? <Table {...config}/>
              : null}
          </div>
        </div>
        {module.isLoading ? <ChartSpinner/> : null}
      </div>
    )
  }
})

export default ChartContainer
