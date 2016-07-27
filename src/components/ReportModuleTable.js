import React from 'react'
import {styled} from './mixins/styled'
import csjs from 'csjs'
import map from 'lodash/map'
import forEach from 'lodash/forEach'
import flow from 'lodash/flow'
import find from 'lodash/find'
import memoize from 'lodash/memoize'
import get from 'lodash/get'
import stableSort from 'stable'
import entityType from '../propTypes/report-entity'

const style = csjs`
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

const ReportModuleTable = React.createClass({
  displayName: 'Module-Table',
  mixins: [styled(style)],
  propTypes: {
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
  render () {
    const {sort} = this.state
    const {result, attributes, entity: {list}} = this.props

    if (!result.length) {
      return null
    }

    const headers = map(result[0], this.getHeaderName)
    const sorter = flow(map(sort, sortWith))
    const getName = memoize(id => get(find(list, {id}), 'name', id))
    const rows = sorter(map(result, row => {
      const parsed = {}

      forEach(headers, ({value}) => {
        parsed[value] = value === 'id'
          ? getName(row[value])
          : row[value]
      })

      return parsed
    }))

    return (
      <table className='mdl-data-table'>
        <thead>
          <tr>
            {map(headers, ({text, value}) =>
              <th key={value} className={attributes[value].is_metric ? '' : 'mdl-data-table__cell--non-numeric'}>
                {text}
              </th>)}
          </tr>
        </thead>
        <tbody>
          {map(rows, (row, index) =>
            <tr key={index}>
              {map(headers, ({value}) =>
                <td key={value} className={attributes[value].is_metric ? '' : 'mdl-data-table__cell--non-numeric'}>
                  {row[value]}
                </td>)}
            </tr>)}
        </tbody>
      </table>
    )
  }
})

export default ReportModuleTable
