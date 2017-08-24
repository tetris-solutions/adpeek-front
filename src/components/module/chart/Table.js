import concat from 'lodash/concat'
import get from 'lodash/get'
import {routeParamsBasedBranch} from '../../higher-order/branch'
import csjs from 'csjs'
import cx from 'classnames'
import find from 'lodash/find'
import isObject from 'lodash/isPlainObject'
import isString from 'lodash/isString'
import compact from 'lodash/compact'
import forEach from 'lodash/forEach'
import fromPairs from 'lodash/fromPairs'
import indexOf from 'lodash/indexOf'
import map from 'lodash/map'
import pick from 'lodash/pick'
import sortBy from 'lodash/sortBy'
import stableSort from 'stable'
import toPairs from 'lodash/toPairs'
import React from 'react'
import PropTypes from 'prop-types'
import isNumber from 'lodash/isNumber'
import {prettyNumber} from '../../../functions/pretty-number'
import entityType from '../../../propTypes/report-entity'
import reportParamsType from '../../../propTypes/report-params'
import Ad from './TableAd'
import Video, {Channel} from './TableVideo'
import {styledFunctionalComponent} from '../../higher-order/styled'
import {isWrapDate} from '../../../functions/is-wrap-date'
import includes from 'lodash/includes'
import isArray from 'lodash/isArray'
import isEmpty from 'lodash/isEmpty'
import {getEmptyModuleMessage} from '../../../functions/get-empty-module-message'

function getAccountSelector (id) {
  if (!includes(id, ':')) return id

  const [tetris_account, ad_account] = id.split(':').slice(0, 2)

  return {tetris_account, ad_account}
}

function mountAnalyticsCampaign (id) {
  const name = id.split(':').slice(2).join(':')

  return {id: name, name}
}

const style = csjs`
.table {
  width: 100%;
}
.clickable {
  cursor: pointer
}
.th > i {
  font-size: medium;
  transform: translateY(.2em);
  padding-left: .3em;
}
.title {
  text-align: center !important;
  font-size: large !important;
}
.icon {
  float: right;
}
.placeholder {
  line-height: 4em !important;
  color: #8a8a8a !important;
  font-size: medium !important;
  font-style: italic !important;
  text-align: center !important;
}
.cell[title] {
  font-style: italic;
}
.chip {
  margin-right: 3px;
}`

class Sortable {
  constructor (content, sortKey) {
    this.content = content
    this.sortKey = sortKey
  }
}

function normalizeForSorting (val) {
  if (isObject(val) && val.value !== undefined && val.raw !== undefined) {
    return val.value
  }

  if (isWrapDate(val)) {
    return val.date
  }

  return (
    isNumber(val) || isString(val)
  ) ? val : -Infinity
}

function comparison (field, order, a, b) {
  const aValue = a[field] instanceof Sortable ? a[field].sortKey : normalizeForSorting(a[field])
  const bValue = b[field] instanceof Sortable ? b[field].sortKey : normalizeForSorting(b[field])

  if (aValue === bValue) return 0

  if (order === 'asc') {
    return aValue < bValue ? -1 : 1
  } else {
    return aValue < bValue ? 1 : -1
  }
}

function sortHeaders (headers, fieldSort) {
  function includeIndex (field) {
    const foundIndex = indexOf(fieldSort, field)
    return {
      field,
      index: foundIndex >= 0 ? foundIndex : Infinity
    }
  }

  const indexedFields = map(headers, includeIndex)

  return map(sortBy(indexedFields, 'index'), 'field')
}

const THeader = ({columns, attributes, sortPairs, toggle}) => (
  <tr>
    {map(columns, header =>
      <ReportModuleTableTH key={header} {...attributes[header]} order={sortPairs[header]} toggle={toggle}/>)}
  </tr>
)

THeader.displayName = 'Report-Result-THeader'
THeader.propTypes = {
  columns: PropTypes.array,
  sortPairs: PropTypes.object,
  toggle: PropTypes.func,
  attributes: PropTypes.object
}

function Cell ({attribute: {is_metric, type, is_percentage}, value: raw}, {locales, moment}) {
  const tdProps = {}

  let value = raw

  if (type === 'special') {
    if (isObject(value)) {
      value = raw.value

      if (isString(raw.raw)) {
        tdProps.title = raw.raw
      }
    }

    if (is_percentage) {
      type = 'percentage'
    }
  }

  if (isNumber(value)) {
    tdProps['data-raw'] = JSON.stringify(value)
    value = prettyNumber(value, type, locales)
  }

  if (isWrapDate(value)) {
    const m = moment(value.date)

    if (value.isSimpleDate) {
      tdProps['data-raw'] = JSON.stringify(m.format('YYYY-MM-DD'))
      tdProps['data-date'] = ''
    }

    value = m.format(value.dateFormat)
  }

  let content = '---'

  if (isString(value) || React.isValidElement(value)) {
    content = value
  } else if (isArray(value)) {
    content = map(value, (str, index) => (
      <span className={`mdl-chip ${style.chip}`} key={index}>
        <span className='mdl-chip__text'>
          {str}
        </span>
      </span>
    ))
  }

  return (
    <td className={is_metric ? `${style.cell}` : `${style.cell} mdl-data-table__cell--non-numeric`} {...tdProps}>
      {content}
    </td>
  )
}

Cell.defaultProps = {
  attribute: {
    is_metric: false
  }
}
Cell.contextTypes = {
  locales: PropTypes.string.isRequired,
  moment: PropTypes.func.isRequired
}
Cell.displayName = 'Report-Result-Cell'
Cell.propTypes = {
  value: PropTypes.any,
  attribute: PropTypes.shape({
    is_metric: PropTypes.bool.isRequired,
    type: PropTypes.string
  }).isRequired
}

const TBody = ({rows, columns, attributes}) => (
  <tbody>{map(rows, (row, index) =>
    <tr key={index}>{map(columns, column =>
      <Cell
        key={column}
        attribute={attributes[column]}
        value={row[column] instanceof Sortable ? row[column].content : row[column]}/>)}
    </tr>)}
  </tbody>
)

TBody.displayName = 'Report-Result-TBody'
TBody.propTypes = {
  rows: PropTypes.arrayOf(PropTypes.object),
  columns: PropTypes.array,
  attributes: PropTypes.object
}

const EmptyTBody = ({colSpan, children}) => (
  <tbody>
    <tr>
      <td className={style.placeholder} colSpan={colSpan}>
        {children}
      </td>
    </tr>
  </tbody>
)

EmptyTBody.displayName = 'Report-Result-Empty-TBody'
EmptyTBody.propTypes = {
  colSpan: PropTypes.number,
  children: PropTypes.node
}

class ReportModuleTableTH extends React.Component {
  static displayName = 'Header'

  static propTypes = {
    id: PropTypes.string.isRequired,
    name: PropTypes.string.isRequired,
    is_metric: PropTypes.bool,
    toggle: PropTypes.func,
    order: PropTypes.oneOf(['asc', 'desc'])
  }

  onClick = () => {
    this.props.toggle(this.props.id)
  }

  render () {
    const {toggle, name, is_metric, order} = this.props
    const classes = cx({
      [style.th]: true,
      'mdl-data-table__cell--non-numeric': !is_metric
    })

    return (
      <th className={classes}>
        <span className={toggle ? `${style.clickable}` : undefined} onClick={toggle ? this.onClick : undefined}>
          {name}
        </span>

        {Boolean(order) && (
          <i className='material-icons'>
            {order === 'asc' ? 'keyboard_arrow_down' : 'keyboard_arrow_up'}
          </i>)}
      </th>
    )
  }
}

const crop = (ls, n) => n ? ls.slice(0, n) : ls

class ReportModuleTable extends React.Component {
  static displayName = 'Module-Table'

  static propTypes = {
    config: PropTypes.shape({
      type: PropTypes.string,
      channels: PropTypes.object,
      sort: PropTypes.array,
      change: PropTypes.func,
      limit: PropTypes.number,
      isLoading: PropTypes.bool,
      name: PropTypes.string,
      reportParams: reportParamsType,
      query: PropTypes.object,
      entity: entityType,
      attributes: PropTypes.object.isRequired,
      result: PropTypes.array.isRequired
    })
  }

  static contextTypes = {
    messages: PropTypes.object.isRequired,
    locales: PropTypes.string.isRequired,
    report: PropTypes.object.isRequired,
    accounts: PropTypes.array.isRequired
  }

  static defaultProps = {
    channels: {}
  }

  toggleHeader = (id) => {
    const sortObj = pick(fromPairs(this.props.config.sort), id, '_fields_')

    if (sortObj[id] === 'desc') {
      sortObj[id] = 'asc'
    } else {
      sortObj[id] = 'desc'
    }

    this.props.config.change({sort: toPairs(sortObj)})
  }

  getEntityComponentById = (id) => {
    const {accounts, report: {platform: reportPlatform}} = this.context
    const {entity: {id: entityId, list}, reportParams} = this.props.config

    const platform = reportPlatform ||
      get(find(accounts, getAccountSelector(id)), 'platform')

    const item = platform === 'analytics'
      ? (
        reportPlatform
          ? {id, name: id}
          : mountAnalyticsCampaign(id)
      ) : find(list, {id})

    if (!item) {
      return null
    }

    const sortKey = item.name || item.headline || id

    if (entityId === 'Video') {
      return new Sortable(<Video {...item} />, sortKey)
    }

    if (entityId === 'Ad') {
      return new Sortable(<Ad {...item} reportParams={reportParams}/>, sortKey)
    }

    return new Sortable(item.name || id, sortKey)
  }

  getChannelColumn = (channelId) => {
    const data = get(this.props.config.channels, channelId, {})

    return new Sortable(<Channel id={channelId} {...data}/>, get(data, 'channel.title', channelId))
  }

  getRowCompareFn = () => {
    const {sort, query: {metrics, dimensions}} = this.props.config
    const sortCol = find(sort, ([name]) => (
      includes(dimensions, name) ||
      includes(metrics, name)
    ))

    if (sortCol) {
      return (a, b) => comparison(sortCol[0], sortCol[1], a, b)
    } else if (includes(dimensions, 'date')) {
      return (a, b) => comparison('date', 'asc', a, b)
    }

    return (a, b) => comparison(metrics[0], 'desc', a, b)
  }

  render () {
    const {
      type,
      entity,
      sort,
      limit,
      isLoading,
      name,
      result,
      query,
      attributes
    } = this.props.config

    const sortPairs = fromPairs(sort)
    const fields = query ? concat(query.dimensions, query.metrics) : []
    const fieldSort = sortPairs._fields_ || fields

    delete sortPairs._fields_

    const columns = sortHeaders(fields, fieldSort)
    let tbody = null
    let colHeaders = null

    if (isEmpty(result)) {
      const {messages, locales} = this.context

      tbody = (
        <EmptyTBody colSpan={columns.length || 1}>
          {getEmptyModuleMessage({
            messages,
            locales,
            type,
            result,
            isLoading,
            query,
            entity
          })}
        </EmptyTBody>
      )
    } else {
      const customSort = this.getRowCompareFn()
      const normalizeRow = row => {
        const parsedRow = {}

        forEach(columns, field => {
          if (field === 'id') {
            parsedRow[field] = this.getEntityComponentById(row[field])
          } else if (field === 'channelid') {
            parsedRow[field] = this.getChannelColumn(row[field])
          } else {
            parsedRow[field] = row[field]
          }
        })

        return parsedRow.id === null ? null : parsedRow
      }
      const normalizedResult = map(result, normalizeRow)
      const validRows = compact(normalizedResult)
      const sorted = stableSort(validRows, customSort)
      const rows = crop(sorted, limit)

      colHeaders = (
        <THeader
          columns={columns}
          attributes={attributes}
          sortPairs={sortPairs}
          toggle={this.props.config.change ? this.toggleHeader : null}/>
      )

      tbody = <TBody rows={rows} columns={columns} attributes={attributes}/>
    }

    return (
      <table className={`mdl-data-table ${style.table}`}>
        <thead>
          <tr>
            <th className={`mdl-data-table__cell--non-numeric ${style.title}`} colSpan={columns.length || 1}>
              {name}
            </th>
          </tr>
          {colHeaders}
        </thead>
        {tbody}
      </table>
    )
  }
}

const VideoWrapper = props => (
  <ReportModuleTable {...props} channels={props.company.channels}/>
)

VideoWrapper.displayName = 'Video-Table-Wrapper'
VideoWrapper.propTypes = {
  company: PropTypes.object
}

const WithChannel = routeParamsBasedBranch('user', 'company', VideoWrapper)

const Wrapper = props => {
  if (props.config.entity.id === 'Video') {
    return <WithChannel {...props}/>
  }

  return <ReportModuleTable {...props}/>
}

Wrapper.displayName = 'Table-Wrapper'
Wrapper.propTypes = {
  config: PropTypes.shape({
    entity: entityType
  })
}

export default styledFunctionalComponent(Wrapper, style)
