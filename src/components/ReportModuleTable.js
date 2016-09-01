import csjs from 'csjs'
import cx from 'classnames'
import find from 'lodash/find'
import findIndex from 'lodash/findIndex'
import flow from 'lodash/flow'
import forEach from 'lodash/forEach'
import fromPairs from 'lodash/fromPairs'
import isObject from 'lodash/isObject'
import keys from 'lodash/keys'
import map from 'lodash/map'
import stableSort from 'stable'
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
.th > span {
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

const Header = React.createClass({
  displayName: 'Header',
  propTypes: {
    id: PropTypes.string.isRequired,
    name: PropTypes.string.isRequired,
    is_metric: PropTypes.bool,
    toggle: PropTypes.func.isRequired,
    order: PropTypes.oneOf(['asc', 'desc'])
  },
  onClick () {
    this.props.toggle(this.props.id)
  },
  render () {
    const {name, is_metric, order} = this.props
    const classes = cx({
      [style.th]: true,
      'mdl-data-table__cell--non-numeric': !is_metric
    })

    return (
      <th className={classes}>
        <span onClick={this.onClick}>{name}</span>

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
    limit: PropTypes.number,
    isLoading: PropTypes.bool,
    name: PropTypes.string,
    reportParams: reportParamsType,
    entity: entityType,
    attributes: PropTypes.object.isRequired,
    result: PropTypes.array.isRequired
  },
  getInitialState () {
    return {
      sort: [['id', 'asc'], ['date', 'asc']]
    }
  },
  getHeaderName (_, header) {
    const {attributes} = this.props

    const text = attributes[header]
      ? attributes[header].name
      : header

    return {text, value: header}
  },
  toggleHeader (id) {
    const sort = this.state.sort.concat()
    const index = findIndex(sort, ([key, val]) => key === id)

    if (index === -1) {
      sort.push([id, 'asc'])
    } else {
      const currentOrder = sort[index][1]

      if (currentOrder === 'asc') {
        sort[index] = [id, 'desc']
      } else {
        sort.splice(index, 1)
      }
    }

    this.setState({sort})
  },
  render () {
    const {sort} = this.state
    const sortPairs = fromPairs(sort)

    const {
      limit,
      isLoading,
      name,
      reportParams,
      result,
      attributes,
      entity: {
        id: entityId,
        list
      }
    } = this.props

    const headers = keys(result[0])
    let tbody = null
    let colHeaders = null

    if (result.length) {
      const customSort = flow(map(sort, sortWith))
      const getName = id => {
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

        return {content: item.name || id, sortKey}
      }

      const rows = crop(customSort(map(result, row => {
        const parsed = {}

        forEach(headers, value => {
          parsed[value] = value === 'id'
            ? getName(row[value])
            : row[value]
        })

        return parsed
      })), limit)

      colHeaders = (
        <tr>
          {map(headers, header =>
            <Header
              key={header}
              {...attributes[header]}
              order={sortPairs[header]}
              toggle={this.toggleHeader}/>)}
        </tr>
      )

      tbody = (
        <tbody>
          {map(rows, (row, index) =>
            <tr key={index}>
              {map(headers, header =>
                <td key={header} className={attributes[header].is_metric ? '' : 'mdl-data-table__cell--non-numeric'}>
                  {isObject(row[header])
                    ? row[header].content
                    : row[header]}
                </td>)}
            </tr>)}
        </tbody>
      )
    } else {
      tbody = (
        <tbody>
          <tr>
            <td className={`${style.placeholder}`} colSpan={headers.length || 1}>
              <Message>{isLoading ? 'loadingReport' : 'emptyReportResult'}</Message>
            </td>
          </tr>
        </tbody>
      )
    }

    return (
      <table className={`mdl-data-table ${style.table}`}>
        <thead>
          <tr>
            <th className={`mdl-data-table__cell--non-numeric ${style.title}`} colSpan={headers.length || 1}>
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
