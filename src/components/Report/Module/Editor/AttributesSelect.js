import csjs from 'csjs'
import cx from 'classnames'
import includes from 'lodash/includes'
import map from 'lodash/map'
import React from 'react'
import ReactDOM from 'react-dom'
import {styledFnComponent} from '../../../higher-order/styled-fn-component'

/**
 * finds the root list
 * @param {HTMLLIElement} li list item element
 * @return {HTMLUListElement} the top most ul
 */
function getTopUl (li) {
  let currentLevel
  let parentLevel = li

  do {
    currentLevel = parentLevel.parentNode
    parentLevel = currentLevel.closest('ul')
  } while (parentLevel)

  return currentLevel
}

function getIdsBetween (topUl, first, last) {
  if (!first || first === last) return

  const lis = topUl.querySelectorAll('li[data-selectable]')

  let lastIndex = null
  let firstIndex = null
  let i

  for (i = 0; i < lis.length; i++) {
    const li = lis[i]

    if (li === first) firstIndex = i
    if (li === last) lastIndex = i

    if (firstIndex !== null && lastIndex !== null) break
  }

  const ids = []

  if (firstIndex > lastIndex) {
    for (i = firstIndex; i >= lastIndex; i--) {
      ids.push(lis[i]._getId())
    }
  } else {
    for (i = firstIndex; i <= lastIndex; i++) {
      ids.push(lis[i]._getId())
    }
  }

  return ids
}

const style = csjs`
.list {
  padding: 0;
  margin: 0;
  list-style: none;
}
.item {
  padding-left: 1em;
  border-left: 3px solid #e4e4e4;
  cursor: pointer;
  line-height: 1.8em;
  user-select: none;
  white-space: nowrap;
  text-overflow: ellipsis;
  overflow: hidden;
}
.fixed {
  color: #232363
}
.disabled {
  font-weight: bold;
  color: #e4e4e4
}
.selected {
  border-left: 3px solid #79cbf3;
  font-weight: bold;
  color: #004465
}`

const {PropTypes} = React

function TextAd ({onClick, className, headline, description, selectable}) {
  return (
    <li onClick={onClick} className={className} data-selectable={selectable ? true : undefined}>
      <div>
        <strong>{headline}</strong>
        <br/>
        <small>{description}</small>
      </div>
    </li>
  )
}

TextAd.displayName = 'Text-Ad'
TextAd.propTypes = {
  className: PropTypes.string.isRequired,
  onClick: PropTypes.func.isRequired,
  headline: PropTypes.string,
  description: PropTypes.string,
  selectable: PropTypes.bool
}

const GenericItem = ({onClick, className, id, name, selectable}) => (
  <li onClick={onClick} className={className} title={name || id} data-selectable={selectable ? true : undefined}>
    {name || id}
  </li>
)

GenericItem.displayName = 'Generic-Item'
GenericItem.propTypes = {
  className: PropTypes.string.isRequired,
  onClick: PropTypes.func.isRequired,
  name: PropTypes.string,
  id: PropTypes.string.isRequired,
  selectable: PropTypes.bool
}

const Attribute = React.createClass({
  displayName: 'Attribute',
  getDefaultProps () {
    return {
      fixed: false
    }
  },
  propTypes: {
    id: PropTypes.string.isRequired,
    name: PropTypes.string,
    type: PropTypes.string,
    urls: PropTypes.array,
    headline: PropTypes.string,
    description: PropTypes.string,
    selected: PropTypes.bool.isRequired,
    toggle: PropTypes.func
  },
  onClick (e) {
    e.persist()
    const {currentTarget: li, nativeEvent: {shiftKey, ctrlKey}} = e
    const {toggle, id} = this.props

    if (!toggle) return

    let ids = [id]
    const topUl = getTopUl(li)

    if (topUl) {
      if (topUl._lastChecked && shiftKey || ctrlKey) {
        ids = ids.concat(getIdsBetween(topUl, topUl._lastChecked, li))
      }
      topUl._lastChecked = li
    }

    toggle(ids)
  },
  componentDidMount () {
    const el = ReactDOM.findDOMNode(this)

    el._getId = () => this.props.id
    el._isSelected = () => this.props.selected
  },
  render () {
    const {selected, toggle, headline} = this.props
    const className = cx({
      [style.item]: true,
      [style.selected]: selected,
      [style.fixed]: selected && !toggle,
      [style.disabled]: !selected && !toggle
    })
    const Component = headline
      ? TextAd
      : GenericItem

    return (
      <Component
        {...this.props}
        onClick={this.onClick}
        className={className}
        selectable={Boolean(toggle)}/>
    )
  }
})

const AttributesSelect = ({attributes, selectedAttributes, isIdSelected, remove, add}) => (
  <div>
    <ul className={`${style.list}`}>
      {map(attributes, item => {
        const isSelected = includes(selectedAttributes, item.id)

        return (
          <Attribute
            {...item}
            selected={isSelected}
            toggle={isSelected ? remove : add}
            key={item.id}/>
        )
      })}
    </ul>
  </div>
)

AttributesSelect.displayName = 'Attributes-Select'
AttributesSelect.propTypes = {
  attributes: PropTypes.array.isRequired,
  selectedAttributes: PropTypes.array.isRequired,
  isIdSelected: PropTypes.bool,
  remove: PropTypes.func.isRequired,
  add: PropTypes.func.isRequired
}

export default styledFnComponent(AttributesSelect, style)
