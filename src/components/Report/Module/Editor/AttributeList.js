import csjs from 'csjs'
import includes from 'lodash/includes'
import map from 'lodash/map'
import React from 'react'
import get from 'lodash/get'
import compact from 'lodash/compact'
import size from 'lodash/size'
import intersection from 'lodash/intersection'
import isEmpty from 'lodash/isEmpty'
import {styledFnComponent} from '../../../higher-order/styled-fn-component'
import AttributeItem from './AttributeItem'
import forEach from 'lodash/forEach'
import groupBy from 'lodash/groupBy'
import flatten from 'lodash/flatten'
import sortBy from 'lodash/sortBy'
import assign from 'lodash/assign'

const style = csjs`
.list {
  padding: 0;
  margin: 0;
  list-style: none;
}
.total {
  color: #004465
}
.partial {
  color: #4650a0
}
.item {
  display: block;
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
}
.item > strong {
  cursor: pointer;
}
.item > i {
  cursor: pointer;
  float: left;
  padding-right: .3em
}
.subTree {
  margin-left: .7em;
}`
const ids = ({ids, id}) => ids || id

function hierarchy (attributes, levels, mount = false) {
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

  const {id: level, openByDefault} = levels[0]
  const grouped = groupBy(attributes, `${level}.id`)
  const subLevel = levels.slice(1)

  forEach(grouped, (branches, id) => {
    const list = hierarchy(branches, subLevel)

    grouped[id] = {
      id,
      name: get(branches, [0, level, 'name']),
      ids: flatten(map(list, ids)),
      openByDefault,
      list: list
    }
  })

  return sortBy(grouped, 'name')
}

const Group = React.createClass({
  displayName: 'Group',
  propTypes: {
    selection: React.PropTypes.string,
    ids: React.PropTypes.array.isRequired,
    name: React.PropTypes.node.isRequired,
    children: React.PropTypes.node.isRequired,
    select: React.PropTypes.func.isRequired,
    unselect: React.PropTypes.func.isRequired,
    openByDefault: React.PropTypes.bool
  },
  getDefaultProps () {
    return {
      openByDefault: false
    }
  },
  getInitialState () {
    return {
      isOpen: this.props.openByDefault
    }
  },
  toggleVisibility () {
    this.setState({isOpen: !this.state.isOpen})
  },
  toggleSelection () {
    const {selection} = this.props

    if (selection === 'total') {
      this.props.unselect(this.props.ids)
    } else {
      this.props.select(this.props.ids)
    }
  },
  render () {
    const {isOpen} = this.state
    const {children, name, selection} = this.props

    return (
      <li>
        <header className={`${style.item} ${selection ? style[selection] : ''}`}>
          <i onClick={this.toggleVisibility} className='material-icons'>{
            isOpen ? 'keyboard_arrow_down' : 'keyboard_arrow_right'
          }</i>
          <strong onClick={this.toggleSelection}>
            {name}
          </strong>
        </header>
        <div className={`${style.subTree}`}>
          {isOpen ? children : null}
        </div>
      </li>
    )
  }
})

const List = ({children}) => <ul className={`${style.list}`}>{children}</ul>

List.displayName = 'List'
List.propTypes = {
  children: React.PropTypes.node.isRequired
}

const AttributeList = ({attributes, selectedAttributes, levels, remove, add}) => {
  function node (item) {
    if (!item.list) {
      const isSelected = includes(selectedAttributes, item.id)

      return (
        <AttributeItem
          {...item}
          selected={isSelected}
          toggle={isSelected ? remove : add}
          key={item.id}/>
      )
    }

    const localSelectionSize = size(intersection(item.ids, selectedAttributes))
    let selection

    if (localSelectionSize) {
      selection = size(item.ids) === localSelectionSize ? 'total' : 'partial'
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
        <List>
          {map(item.list, node)}
        </List>
      </Group>
    )
  }

  return (
    <List>
      {map(hierarchy(attributes, levels, true), node)}
    </List>
  )
}

AttributeList.displayName = 'Attribute-List'
AttributeList.propTypes = {
  levels: React.PropTypes.array,
  attributes: React.PropTypes.array.isRequired,
  selectedAttributes: React.PropTypes.array.isRequired,
  isIdSelected: React.PropTypes.bool,
  remove: React.PropTypes.func.isRequired,
  add: React.PropTypes.func.isRequired
}

export default styledFnComponent(AttributeList, style)
