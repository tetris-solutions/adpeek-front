import map from 'lodash/map'
import React from 'react'
import PropTypes from 'prop-types'
import get from 'lodash/get'
import compact from 'lodash/compact'
import size from 'lodash/size'
import intersection from 'lodash/intersection'
import isEmpty from 'lodash/isEmpty'
import AttributeItem from './AttributeItem'
import forEach from 'lodash/forEach'
import groupBy from 'lodash/groupBy'
import flatten from 'lodash/flatten'
import orderBy from 'lodash/orderBy'
import assign from 'lodash/assign'
import head from 'lodash/head'
import tail from 'lodash/tail'
import every from 'lodash/every'
import {Tree, Node} from '../../Tree'

const ids = ({ids, id}) => ids || id

function buildTree (attributes, levels, mount = false) {
  function extend (attr) {
    attr = assign({}, attr)

    for (let i = levels.length - 1; i >= 0; i--) {
      const {id: level, mount} = levels[i]
      const levelInfo = mount(attr)

      if (levelInfo) {
        attr[level] = levelInfo
      } else {
        return null
      }
    }

    return attr
  }

  if (isEmpty(levels)) {
    return attributes
  }

  if (mount) {
    attributes = compact(map(attributes, extend))
  }

  const {id: level, openByDefault} = head(levels)
  const grouped = groupBy(attributes, `${level}.id`)
  const innerLevel = tail(levels)

  forEach(grouped, (items, id) => {
    const sample = head(items)
    const list = buildTree(items, innerLevel)

    grouped[id] = {
      id,
      shared: get(sample, [level, 'shared']),
      name: get(sample, [level, 'name']),
      ids: flatten(map(list, ids)),
      openByDefault,
      list: list
    }
  })

  return orderBy(grouped, ['shared', 'name'], ['desc', 'asc'])
}

class Group extends React.Component {
  static displayName = 'Group'

  static propTypes = {
    selection: PropTypes.string,
    ids: PropTypes.array.isRequired,
    name: PropTypes.node.isRequired,
    children: PropTypes.node.isRequired,
    select: PropTypes.func.isRequired,
    unselect: PropTypes.func.isRequired,
    openByDefault: PropTypes.bool
  }

  static defaultProps = {
    openByDefault: false
  }

  toggleSelection = () => {
    const {selection} = this.props

    if (selection === 'total') {
      this.props.unselect(this.props.ids)
    } else {
      this.props.select(this.props.ids)
    }
  }

  render () {
    const {children, name, selection} = this.props

    return (
      <Node label={name} selection={selection} onClick={this.toggleSelection}>
        {children}
      </Node>
    )
  }
}

const AttributeList = ({attributes, selectedAttributes, levels, remove, add}) => {
  function node (item) {
    const ids = item.ids ? item.ids : [item.id]
    const localSelectionSize = size(intersection(ids, selectedAttributes))
    let selection

    if (localSelectionSize) {
      selection = size(ids) === localSelectionSize ? 'total' : 'partial'
    }

    if (every(item.list, 'hidden')) {
      return (
        <AttributeItem
          {...item}
          selected={selection === 'total'}
          toggle={selection === 'total' ? remove : add}
          key={item.id}/>
      )
    }

    return (
      <Group
        key={item.id}
        openByDefault={item.openByDefault}
        selection={selection}
        ids={item.ids}
        name={item.name}
        select={add}
        unselect={remove}>
        <Tree>
          {map(item.list, node)}
        </Tree>
      </Group>
    )
  }

  const items = buildTree(attributes, levels, true)

  return (
    <Tree>
      {map(items, node)}
    </Tree>
  )
}

AttributeList.displayName = 'Attribute-List'
AttributeList.propTypes = {
  levels: PropTypes.array,
  attributes: PropTypes.array.isRequired,
  selectedAttributes: PropTypes.array.isRequired,
  isIdSelected: PropTypes.bool,
  remove: PropTypes.func.isRequired,
  add: PropTypes.func.isRequired
}

export default AttributeList

