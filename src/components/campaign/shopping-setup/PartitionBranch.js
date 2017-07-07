import React from 'react'
import PropTypes from 'prop-types'
import Message from 'tetris-iso/Message'
import Modal from 'tetris-iso/Modal'
import {Node, Tree} from '../../Tree'
import map from 'lodash/map'
import find from 'lodash/find'
import filter from 'lodash/filter'
import get from 'lodash/get'
import {productScopeTypes, inferMsgName, inferOptionMsgName} from './types'
import forEach from 'lodash/forEach'
import DimensionEditor from './ProductPartitionDimensionEditor'
import csjs from 'csjs'
import {styledComponent} from '../../higher-order/styled'

const style = csjs`
.action {
  color: inherit;
  margin-right: 1em
}`

const parseCategory = ({name: text, value}) => ({text, value})

function isBiddingCategory (dimension) {
  return (
    dimension &&
    dimension.ProductDimensionType === 'ProductBiddingCategory' &&
    dimension.value !== null
  )
}

function hasCategoryChild (children) {
  let found = false

  forEach(children, child => {
    if (isBiddingCategory(child.dimension) || hasCategoryChild(child.children)) {
      found = true
      return false
    }
  })

  return found
}

class PartitionBranch extends React.Component {
  static displayName = 'Partition-Branch'
  static propTypes = {
    update: PropTypes.func.isRequired,
    appendChild: PropTypes.func.isRequired,
    children: PropTypes.object,
    parent: PropTypes.object,
    categories: PropTypes.array,
    id: PropTypes.string.isRequired,
    dimension: PropTypes.shape({
      id: PropTypes.string,
      ProductDimensionType: PropTypes.string,
      type: PropTypes.string,
      channel: PropTypes.string,
      channelExclusivity: PropTypes.string,
      condition: PropTypes.string,
      value: PropTypes.any
    })
  }

  static contextTypes = {
    messages: PropTypes.object
  }

  state = {
    openEditor: false
  }

  isRoot () {
    return !this.props.parent || !this.props.dimension
  }

  isPlaceholder () {
    return (
      !this.isRoot() &&
      this.props.dimension[this.getTypeConfig().valueField] === null
    )
  }

  isLeaf () {
    return !this.isRoot() &&
      (
        this.isPlaceholder() ||
        this.props.dimension.type === 'OFFER_ID'
      )
  }

  isCategory () {
    return isBiddingCategory(this.props.dimension)
  }

  getTypeConfig = () => {
    return productScopeTypes[this.props.dimension.type]
  }

  inferLabel () {
    if (this.isRoot()) {
      return <Message>rootPartitionLabel</Message>
    }

    const {categories, dimension} = this.props

    if (this.isCategory() && dimension.value) {
      const category = find(categories, {value: Number(dimension.value)})

      return get(category, 'name', dimension.value)
    }

    const {messages} = this.context
    const {valueField} = this.getTypeConfig()
    const config = this.getTypeConfig()
    const typeName = messages[inferMsgName(dimension.type)]

    let value = dimension[valueField]

    if (value === null) {
      return <Message>otherProducts</Message>
    }

    if (config.options) {
      value = messages[inferOptionMsgName(value)]
    }

    value = value || '---'

    return `${typeName}: ${value}`
  }

  parseOption = value => {
    return {
      value,
      text: this.context.messages[inferOptionMsgName(value)]
    }
  }

  getOptions () {
    if (this.isRoot()) {
      return []
    }

    const config = this.getTypeConfig()

    if (!this.isCategory()) {
      return map(config.options, this.parseOption)
    }

    const type = this.props.dimension.type
    const parentValue = get(this.self(), 'parent.dimension.value')
    const parent = parentValue ? Number(parentValue) : null

    return map(
      filter(this.props.categories, {type, parent}),
      parseCategory
    )
  }

  onChange = ({target: {name, value}}) => {
    const changes = {[name]: value}

    if (name === 'type') {
      changes.ProductDimensionType = productScopeTypes[value].scopeClass
      changes.value = ''
    }

    this.props.update(this.self(), changes)
  }

  self () {
    return get(this.props, `parent.children.${this.props.id}`, this.props)
  }

  onClickAdd = e => {
    e.preventDefault()

    this.props.appendChild(this.self())
  }

  onClickRemove = e => {
    e.preventDefault()
    this.props.update(this.props, null)
  }

  onClickEdit = e => {
    e.preventDefault()

    this.toggleEditor()
  }

  toggleEditor = () => {
    this.setState({openEditor: !this.state.openEditor})
  }

  render () {
    const {dimension, children} = this.props

    const editable = (
      !this.isRoot() &&
      !this.isPlaceholder() && (
        !this.isCategory() ||
        !hasCategoryChild(children)
      )
    )
    const valueField = editable ? this.getTypeConfig().valueField : null
    const title = this.inferLabel()

    const label = (
      <span>
        {title}

        {editable && (
          <a className={style.action} href='' onClick={this.onClickEdit}>
            <i className='material-icons'>mode_edit</i>
          </a>)}

        {!this.isLeaf() && (
          <a className={style.action} href='' onClick={this.onClickAdd}>
            <i className='material-icons'>add</i>
          </a>)}

        {editable && (
          <a className={style.action} href='' onClick={this.onClickRemove}>
            <i className='material-icons'>close</i>
          </a>)}

        {editable && this.state.openEditor && (
          <Modal size='small' minHeight={0} onEscPress={this.toggleEditor}>
            <DimensionEditor
              title={title}
              type={dimension && dimension.type}
              onChange={this.onChange}
              options={this.getOptions()}
              value={dimension[valueField]}
              name={valueField}/>
          </Modal>)}
      </span>
    )

    return (
      <Node label={label}>
        <Tree>
          {map(children, partition =>
            <PartitionBranch
              key={partition.id}
              {...this.props}
              {...partition}/>)}
        </Tree>
      </Node>
    )
  }
}

export default styledComponent(PartitionBranch, style)
