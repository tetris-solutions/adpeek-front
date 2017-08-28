import csjs from 'csjs'
import ReactDOM from 'react-dom'
import floor from 'lodash/floor'
import React from 'react'
import PropTypes from 'prop-types'
import reportEntityType from '../../../propTypes/report-entity'
import reportModuleType from '../../../propTypes/report-module'
import Column from './Column'
import Line from './Line'
import Pie from './Pie'
import Spinner from '../../Spinner'
import Table from './Table'
import Total from './Total'
import {styledComponent} from '../../higher-order/styled'

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
  <div className={style.spinner}>
    <Spinner/>
  </div>
)

const emptyResult = []

const A4Ratio = 674 / 1032
const counters = {}

class Chart extends React.Component {
  static displayName = 'Chart'

  static defaultProps = {
    height: '100%'
  }

  static propTypes = {
    config: PropTypes.shape({
      change: PropTypes.func,
      height: PropTypes.oneOfType([
        PropTypes.string,
        PropTypes.number
      ]),
      accounts: PropTypes.array,
      report: PropTypes.object,
      renderHiddenTable: PropTypes.bool,
      type: PropTypes.string,
      locales: PropTypes.string,
      sort: PropTypes.array,
      limit: PropTypes.number,
      isLoading: PropTypes.bool,
      reportParams: PropTypes.object,
      sourceWidth: PropTypes.number,
      sourceHeight: PropTypes.number,
      id: PropTypes.string,
      name: PropTypes.string,
      messages: PropTypes.object,
      attributes: PropTypes.object,
      entity: PropTypes.object,
      result: PropTypes.array,
      comments: PropTypes.array,
      query: PropTypes.object
    })
  }

  render () {
    const {config} = this.props
    const Renderer = typeComponent[config.type]

    counters[config.id] = (counters[config.id] || 0) + 1

    return (
      <div>
        <div className={style.wrap} style={{height: config.height}}>
          <Renderer config={config}/>
          <div className={style.hidden} data-interface>
            {config.renderHiddenTable
              ? <Table config={config}/>
              : null}
          </div>
        </div>
        {config.isLoading ? <ChartSpinner/> : null}
      </div>
    )
  }
}

class ChartContainer extends React.Component {
  static displayName = 'Chart-Wrapper'

  static propTypes = {
    change: PropTypes.func,
    height: PropTypes.number
  }

  static contextTypes = {
    messages: PropTypes.object,
    report: PropTypes.object,
    accounts: PropTypes.array,
    locales: PropTypes.string,
    module: reportModuleType.isRequired,
    entity: reportEntityType.isRequired,
    attributes: PropTypes.object.isRequired,
    reportParams: PropTypes.object.isRequired
  }

  state = {
    renderHiddenTable: false
  }

  renderAsTable = () => {
    const unlock = () => this.setState({renderHiddenTable: false})

    return new Promise(resolve => this.setState({renderHiddenTable: true},
      function resolveThenUnlock () {
        resolve()
        setTimeout(unlock, 300)
      }))
  }

  componentDidMount () {
    const intr = ReactDOM.findDOMNode(this).querySelector('[data-interface]')

    intr.renderAsTable = this.renderAsTable
  }

  render () {
    const {renderHiddenTable} = this.state
    const {accounts, report, module, locales, reportParams, entity, attributes} = this.context
    const {change, height} = this.props

    const config = {
      id: module.id,
      accounts,
      report,
      name: module.name,
      height: height,
      change,
      renderHiddenTable,
      type: module.type,
      responseError: module.responseError,
      locales: locales,
      sort: module.sort,
      limit: module.limit,
      isLoading: module.isLoading,
      reportParams: reportParams,
      sourceWidth: 1200,
      sourceHeight: floor(1200 * A4Ratio),
      messages: this.context.messages,
      attributes: attributes,
      entity: entity,
      result: module.result || emptyResult,
      comments: module.comments || emptyResult,
      query: module.query
    }

    return (
      <Chart config={config}/>
    )
  }
}

export default styledComponent(ChartContainer, style)
