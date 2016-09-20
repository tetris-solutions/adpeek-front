import concat from 'lodash/concat'
import csjs from 'csjs'
import cx from 'classnames'
import find from 'lodash/find'
import flow from 'lodash/flow'
import forEach from 'lodash/forEach'
import fromPairs from 'lodash/fromPairs'
import indexOf from 'lodash/indexOf'
import isObject from 'lodash/isObject'
import keys from 'lodash/keys'
import map from 'lodash/map'
import pick from 'lodash/pick'
import sortBy from 'lodash/sortBy'
import stableSort from 'stable'
import toPairs from 'lodash/toPairs'
import Message from '@tetris/front-server/lib/components/intl/Message'
import React from 'react'

import entityType from '../propTypes/report-entity'
import reportParamsType from '../propTypes/report-params'
import Ad from './ReportModuleTableAd'
import {styled} from './mixins/styled'

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

function sortWith ([field, order]) {
  if (field === '_fields_') {
    return ls => ls
  }

  function sortFn (ls) {
    function compare (a, b) {
      const aValue = isObject(a[field]) ? a[field].sortKey : a[field]
      const bValue = isObject(b[field]) ? b[field].sortKey : b[field]

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
  return map(sortBy(map(headers, field => {
    const foundIndex = indexOf(fieldSort, field)
    return {
      field,
      index: foundIndex >= 0 ? foundIndex : Infinity
    }
  }), 'index'), 'field')
}

const THeader = ({columns, attributes, sortPairs, toggle}) => (
  <tr>
    {map(columns, header =>
      <Header key={header} {...attributes[header]} order={sortPairs[header]} toggle={toggle}/>)}
  </tr>
)

THeader.displayName = 'Report-Result-THeader'
THeader.propTypes = {
  columns: PropTypes.array,
  sortPairs: PropTypes.object,
  toggle: PropTypes.func,
  attributes: PropTypes.object
}

const TBody = ({rows, columns, attributes}) => (
  <tbody>
    {map(rows, (row, index) =>
      <tr key={index}>
        {map(columns, column =>
          <td key={column} className={attributes[column].is_metric ? '' : 'mdl-data-table__cell--non-numeric'}>
            {isObject(row[column])
              ? row[column].content
              : row[column]}
          </td>)}
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

const Header = React.createClass({
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
    save: PropTypes.func,
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

    this.props.save({sort: toPairs(sortObj)})
  },
  getFieldName (id) {
    const {entity: {id: entityId, list}, reportParams} = this.props
    const item = find(list, {id})
    let sortKey = id

    if (!item) {
      return {content: id, sortKey}
    }

    sortKey = item.name || item.headline || id

    if (entityId === 'Ad') {
      return {
        content: <Ad {...item} reportParams={reportParams}/>,
        sortKey
      }
    }

    return {
      sortKey,
      content: item.name || id
    }
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
    const fieldSort = sortPairs._fields_ || concat(query.dimensions, query.metrics)

    delete sortPairs._fields_

    const columns = sortHeaders(keys(result[0]), fieldSort)
    let tbody = null
    let colHeaders = null

    if (result.length) {
      const customSort = flow(map(sort, sortWith))

      const rows = crop(customSort(map(result, row => {
        const parsed = {}

        forEach(columns, value => {
          parsed[value] = value === 'id'
            ? this.getFieldName(row[value])
            : row[value]
        })

        return parsed
      })), limit)

      colHeaders = (
        <THeader
          columns={columns}
          attributes={attributes}
          sortPairs={sortPairs}
          toggle={this.props.save ? this.toggleHeader : null}/>
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
