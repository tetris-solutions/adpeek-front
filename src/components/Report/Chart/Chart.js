import csjs from 'csjs'
import ReactDOM from 'react-dom'
import floor from 'lodash/floor'
import pick from 'lodash/pick'
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

const chartProps = [
  'change',
  'locales',
  'sort',
  'limit',
  'isLoading',
  'reportParams',
  'sourceWidth',
  'sourceHeight',
  'name',
  'messages',
  'attributes',
  'entity',
  'result',
  'comments',
  'query'
]

class HardChart extends React.PureComponent {
  render () {
    const {type, renderHiddenTable, isLoading} = this.props
    const config = pick(this.props, chartProps)
    const Chart = typeComponent[type]

    // console.log('will render', config.name)

    return (
      <div>
        <div className={`${style.wrap}`}>
          <Chart {...config}/>
          <div className={`${style.hidden}`} data-interface>
            {renderHiddenTable
              ? <Table {...config}/>
              : null}
          </div>
        </div>
        {isLoading ? <ChartSpinner/> : null}
      </div>
    )
  }
}

HardChart.displayName = 'Hard-Chart'
HardChart.propTypes = {
  change: React.PropTypes.func.isRequired,
  renderHiddenTable: React.PropTypes.bool,
  type: React.PropTypes.string,
  locales: React.PropTypes.string,
  sort: React.PropTypes.array,
  limit: React.PropTypes.number,
  isLoading: React.PropTypes.bool,
  reportParams: React.PropTypes.object,
  sourceWidth: React.PropTypes.number,
  sourceHeight: React.PropTypes.number,
  name: React.PropTypes.string,
  messages: React.PropTypes.object,
  attributes: React.PropTypes.object,
  entity: React.PropTypes.object,
  result: React.PropTypes.array,
  comments: React.PropTypes.array,
  query: React.PropTypes.object
}

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
    const intr = ReactDOM.findDOMNode(this).querySelector('[data-interface]')

    intr.renderAsTable = this.renderAsTable
  },
  render () {
    const {renderHiddenTable} = this.state
    const {module, locales, reportParams, entity, attributes} = this.context
    const {change} = this.props

    const config = {
      change,
      renderHiddenTable,
      type: module.type,
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
      <HardChart {...config}/>
    )
  }
})

export default ChartContainer
