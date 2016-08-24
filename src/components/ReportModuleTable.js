import csjs from 'csjs'
import cx from 'classnames'
import find from 'lodash/find'
import findIndex from 'lodash/findIndex'
import flow from 'lodash/flow'
import forEach from 'lodash/forEach'
import fromPairs from 'lodash/fromPairs'
import keys from 'lodash/keys'
import map from 'lodash/map'
import stableSort from 'stable'
import React from 'react'

import entityType from '../propTypes/report-entity'
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
}`

const {PropTypes} = React

function sortWith ([field, order]) {
  function sortFn (ls) {
    function compare (a, b) {
      if (a[field] === b[field]) return 0

      if (order === 'asc') {
        return a[field] < b[field] ? -1 : 1
      } else {
        return a[field] < b[field] ? 1 : -1
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

const ReportModuleTable = React.createClass({
  displayName: 'Module-Table',
  mixins: [styled(style)],
  propTypes: {
    name: PropTypes.string,
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
    const {name, result, attributes, entity: {id: entityId, list}} = this.props
    const headers = keys(result[0])
    let tbody = null
    let colHeaders = null

    if (result.length) {
      const sorter = flow(map(sort, sortWith))
      const getName = id => {
        const item = find(list, {id})

        if (!item) return id

        if (entityId === 'Ad') {
          return <Ad {...item}/>
        }

        return item.name || id
      }

      const rows = sorter(map(result, row => {
        const parsed = {}

        forEach(headers, value => {
          parsed[value] = value === 'id'
            ? getName(row[value])
            : row[value]
        })

        return parsed
      }))

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
                  {row[header]}
                </td>)}
            </tr>)}
        </tbody>
      )
    }

    return (
      <table className={`mdl-data-table ${style.table}`}>
        <thead>
          <tr>
            <th className={`mdl-data-table__cell--non-numeric ${style.title}`} colSpan={headers.length}>
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
