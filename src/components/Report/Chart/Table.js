import concat from 'lodash/concat'
import csjs from 'csjs'
import cx from 'classnames'
import find from 'lodash/find'
import isString from 'lodash/isString'
import compact from 'lodash/compact'
import flow from 'lodash/flow'
import forEach from 'lodash/forEach'
import fromPairs from 'lodash/fromPairs'
import indexOf from 'lodash/indexOf'
import map from 'lodash/map'
import pick from 'lodash/pick'
import sortBy from 'lodash/sortBy'
import stableSort from 'stable'
import toPairs from 'lodash/toPairs'
import Message from 'tetris-iso/Message'
import React from 'react'
import isNumber from 'lodash/isNumber'
import {prettyNumber} from '../../../functions/pretty-number'
import entityType from '../../../propTypes/report-entity'
import reportParamsType from '../../../propTypes/report-params'
import Ad from './TableAd'
import {styled} from '../../mixins/styled'
import isDate from 'lodash/isDate'

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
}`

const {PropTypes} = React

class Sortable {
  constructor (content, sortKey) {
    this.content = content
    this.sortKey = sortKey
  }
}

function normalizeForSorting (val) {
  return (
    isNumber(val) || isString(val) || isDate(val)
  ) ? val : -Infinity
}

function sortWith ([field, order]) {
  if (field === '_fields_') {
    return ls => ls
  }

  function sortFn (ls) {
    function compare (a, b) {
      const aValue = a[field] instanceof Sortable ? a[field].sortKey : normalizeForSorting(a[field])
      const bValue = b[field] instanceof Sortable ? b[field].sortKey : normalizeForSorting(b[field])

      if (aValue === bValue) return 0

      if (order === 'asc') {
        return aValue < bValue ? -1 : 1
      } else {
        return aValue < bValue ? 1 : -1
      }
    }

    return stableSort(ls, compare)
  }

  return sortFn
}

function sortHeaders (headers, fieldSort) {
  function normalizeHeader (field) {
    const foundIndex = indexOf(fieldSort, field)
    return {
      field,
      index: foundIndex >= 0 ? foundIndex : Infinity
    }
  }

  return map(sortBy(map(headers, normalizeHeader), 'index'), 'field')
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

function Cell ({attribute: {is_metric, type}, value}, {locales, moment}) {
  if (isNumber(value)) {
    value = prettyNumber(value, type, locales)
  }

  if (isDate(value)) {
    value = moment(value).format(value._format_)
  }

  return (
    <td className={is_metric ? '' : 'mdl-data-table__cell--non-numeric'}>
      {value}
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

const EmptyTBody = ({isLoading, columns}) => (
  <tbody>
    <tr>
      <td className={`${style.placeholder}`} colSpan={columns.length || 1}>
        <Message>{isLoading ? 'loadingReport' : 'emptyReportResult'}</Message>
      </td>
    </tr>
  </tbody>
)

EmptyTBody.displayName = 'Report-Result-Empty-TBody'
EmptyTBody.propTypes = {
  isLoading: PropTypes.bool.isRequired,
  columns: PropTypes.array.isRequired
}
EmptyTBody.defaultProps = {
  isLoading: false
}

const ReportModuleTableTH = React.createClass({
  displayName: 'Header',
  propTypes: {
    id: PropTypes.string.isRequired,
    name: PropTypes.string.isRequired,
    is_metric: PropTypes.bool,
    toggle: PropTypes.func,
    order: PropTypes.oneOf(['asc', 'desc'])
  },
  onClick () {
    this.props.toggle(this.props.id)
  },
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
})

const crop = (ls, n) => n ? ls.slice(0, n) : ls

const ReportModuleTable = React.createClass({
  displayName: 'Module-Table',
  mixins: [styled(style)],
  propTypes: {
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
  },
  getHeaderName (_, header) {
    const {attributes} = this.props

    const text = attributes[header]
      ? attributes[header].name
      : header

    return {text, value: header}
  },
  toggleHeader (id) {
    const sortObj = pick(fromPairs(this.props.sort), id, '_fields_')

    if (sortObj[id] === 'desc') {
      sortObj[id] = 'asc'
    } else {
      sortObj[id] = 'desc'
    }

    this.props.change({sort: toPairs(sortObj)})
  },
  getEntityComponentById (id) {
    const {entity: {id: entityId, list}, reportParams} = this.props
    const item = find(list, {id})

    if (!item) {
      return null
    }

    const sortKey = item.name || item.headline || id

    if (entityId === 'Ad') {
      return new Sortable(<Ad {...item} reportParams={reportParams}/>, sortKey)
    }

    return new Sortable(item.name || id, sortKey)
  },
  render () {
    const {
      sort,
      limit,
      isLoading,
      name,
      result,
      query,
      attributes
    } = this.props

    const sortPairs = fromPairs(sort)
    const fields = concat(query.dimensions, query.metrics)
    const fieldSort = sortPairs._fields_ || fields

    delete sortPairs._fields_

    const columns = sortHeaders(fields, fieldSort)
    let tbody = null
    let colHeaders = null

    if (result.length) {
      const customSort = flow(map(sort, sortWith))
      const normalizeRow = row => {
        const parsedRow = {}

        forEach(columns, value => {
          parsedRow[value] = value === 'id'
            ? this.getEntityComponentById(row[value])
            : row[value]
        })

        return parsedRow.id === null ? null : parsedRow
      }
      const normalizedResult = map(result, normalizeRow)
      const rows = crop(customSort(compact(normalizedResult)), limit)

      colHeaders = (
        <THeader
          columns={columns}
          attributes={attributes}
          sortPairs={sortPairs}
          toggle={this.props.change ? this.toggleHeader : null}/>
      )

      tbody = <TBody rows={rows} columns={columns} attributes={attributes}/>
    } else {
      tbody = <EmptyTBody isLoading={isLoading} columns={columns}/>
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
})

export default ReportModuleTable
