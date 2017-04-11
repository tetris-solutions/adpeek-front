import csjs from 'csjs'
import ReactDOM from 'react-dom'
import floor from 'lodash/floor'
import React from 'react'
import createReactClass from 'create-react-class'
import PropTypes from 'prop-types'
import reportEntityType from '../../../propTypes/report-entity'
import reportModuleType from '../../../propTypes/report-module'
import Column from './Column'
import Line from './Line'
import Pie from './Pie'
import Spinner from '../../Spinner'
import Table from './Table'
import Total from './Total'
import {styled} from '../../mixins/styled'
import log from 'loglevel'

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
const counters = {}

const Chart = props => {
  const Renderer = typeComponent[props.type]

  counters[props.id] = (counters[props.id] || 0) + 1

  log.info(`${counters[props.id]}) render module ${props.name} chart`)

  return (
    <div>
      <div className={`${style.wrap}`} style={{height: props.height}}>
        <Renderer {...props}/>
        <div className={`${style.hidden}`} data-interface>
          {props.renderHiddenTable
            ? <Table {...props}/>
            : null}
        </div>
      </div>
      {props.isLoading ? <ChartSpinner/> : null}
    </div>
  )
}

Chart.defaultProps = {
  height: '100%'
}
Chart.displayName = 'Pure-Chart'
Chart.propTypes = {
  change: PropTypes.func,
  height: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.number
  ]),
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
}

const ChartContainer = createReactClass({
  displayName: 'Chart',
  mixins: [styled(style)],
  propTypes: {
    change: PropTypes.func,
    height: PropTypes.number
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
    const intr = ReactDOM.findDOMNode(this).querySelector('[data-interface]')

    intr.renderAsTable = this.renderAsTable
  },
  render () {
    const {renderHiddenTable} = this.state
    const {module, locales, reportParams, entity, attributes} = this.context
    const {change, height} = this.props

    const config = {
      id: module.id,
      name: module.name,
      height: height,
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
      messages: this.context.messages,
      attributes: attributes,
      entity: entity,
      result: module.result || emptyResult,
      comments: module.comments || emptyResult,
      query: module.query || emptyQuery
    }

    return (
      <Chart {...config}/>
    )
  }
})

export default ChartContainer
