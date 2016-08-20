import React from 'react'
import cx from 'classnames'
import csjs from 'csjs'
import map from 'lodash/map'
import includes from 'lodash/includes'
import diff from 'lodash/difference'
import isEmpty from 'lodash/isEmpty'
import {styledFnComponent} from './higher-order/styled-fn-component'
import filter from 'lodash/filter'
import intersect from 'lodash/intersection'
import find from 'lodash/find'
import get from 'lodash/get'

const style = csjs`
.title {
  margin: .5em .3em .8em 0;
  color: rgba(0, 0, 0, 0.4)
}
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

function TextAd ({onClick, className, headline, description}) {
  return (
    <li onClick={onClick} className={className}>
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
  description: PropTypes.string
}

function ImageAd ({onClick, className, name, urls}) {
  return (
    <li onClick={onClick} className={className}>
      <figure>

        <img src={get(find(urls, 'key', 'PREVIEW'), 'value',
          'http://placehold.it/150x150')}/>

        <figcaption>{name}</figcaption>
      </figure>
    </li>
  )
}

ImageAd.displayName = 'Image-Ad'
ImageAd.propTypes = {
  className: PropTypes.string.isRequired,
  onClick: PropTypes.func.isRequired,
  name: PropTypes.string,
  urls: PropTypes.arrayOf(PropTypes.shape({
    key: PropTypes.string,
    value: PropTypes.string
  }))
}

const GenericItem = ({onClick, className, id, name}) => (
  <li onClick={onClick} className={className} title={name || id}>
    {name || id}
  </li>
)

GenericItem.displayName = 'Generic-Item'
GenericItem.propTypes = {
  className: PropTypes.string.isRequired,
  onClick: PropTypes.func.isRequired,
  name: PropTypes.string,
  id: PropTypes.string.isRequired
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
  onClick () {
    const {toggle, id} = this.props

    if (toggle) {
      toggle(id)
    }
  },
  render () {
    const {type, selected, toggle} = this.props
    const className = cx({
      [style.item]: true,
      [style.selected]: selected,
      [style.fixed]: selected && !toggle,
      [style.disabled]: !selected && !toggle
    })
    let Component = GenericItem

    if (this.props.headline) {
      Component = TextAd
    }

    if (!isEmpty(this.props.urls) && type === 'IMAGE_AD') {
      Component = ImageAd
    }

    return (
      <Component
        {...this.props}
        onClick={this.onClick}
        className={className}/>
    )
  }
})

function Attributes ({title, attributes, selectedAttributes, addItem, removeItem, isIdSelected}) {
  const selectedBreakdowns = intersect(map(filter(attributes, 'is_breakdown'), 'id'), selectedAttributes)

  return (
    <div>
      <h5 className={`${style.title}`}>
        {title}
      </h5>

      <ul className={`${style.list}`}>
        {map(attributes, item => {
          const {id, pairs_with, requires_id} = item
          const isSelected = includes(selectedAttributes, id)
          const invalidPermutation = pairs_with && !isEmpty(diff(selectedBreakdowns, pairs_with))
          const disabledById = requires_id && !isIdSelected
          const addMe = disabledById || invalidPermutation ? undefined : addItem

          return (
            <Attribute
              {...item}
              fixed={isSelected && !removeItem}
              disabled={!isSelected && !addMe}
              selected={isSelected}
              toggle={isSelected ? removeItem : addMe}
              key={id}/>
          )
        })}
      </ul>
    </div>
  )
}

Attributes.displayName = 'Attributes'
Attributes.propTypes = {
  title: PropTypes.node.isRequired,
  addItem: PropTypes.func,
  removeItem: PropTypes.func,
  attributes: PropTypes.array.isRequired,
  selectedAttributes: PropTypes.array.isRequired,
  isIdSelected: PropTypes.bool.isRequired
}

export default styledFnComponent(Attributes, style)
