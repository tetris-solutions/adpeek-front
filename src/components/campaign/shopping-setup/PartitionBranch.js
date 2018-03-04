import React from 'react'
import PropTypes from 'prop-types'
import Message from '@tetris/front-server/Message'
import Modal from '@tetris/front-server/Modal'
import {Node, Tree} from '../../Tree'
import map from 'lodash/map'
import find from 'lodash/find'
import filter from 'lodash/filter'
import get from 'lodash/get'
import {productScopeTypes, inferMsgName, inferOptionMsgName} from './types'
import DimensionEditor from './ProductPartitionDimensionEditor'
import csjs from 'csjs'
import {styledComponent} from '../../higher-order/styled'

const style = csjs`
.action {
  color: inherit;
  margin-left: 1em;
}`

const parseCategory = ({name: text, value}) => ({text, value})

function isBiddingCategory (dimension) {
  return (
    dimension &&
    dimension.productDimensionType === 'ProductBiddingCategory' &&
    dimension.value !== null
  )
}

function hasCategoryChild (children) {
  return find(children, ({dimension, children}) => (
    isBiddingCategory(dimension) || hasCategoryChild(children)
  ))
}

function findParentCategory (node) {
  if (!node) return null

  return isBiddingCategory(node.dimension)
    ? node
    : findParentCategory(node.parent)
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
    type: PropTypes.oneOf(['SUBDIVISION', 'UNIT']).isRequired,
    cpc: PropTypes.number,
    dimension: PropTypes.shape({
      id: PropTypes.string,
      productDimensionType: PropTypes.string,
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
    return !this.props.parent
  }

  isOtherPartition () {
    return (
      !this.isRoot() &&
      this.props.dimension[this.getTypeConfig().valueField] === null
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
      const category = find(categories, {value: dimension.value})

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
    const parentValue = get(findParentCategory(this.props.parent), 'dimension.value')

    return map(
      filter(this.props.categories, {type, parent: parentValue || null}),
      parseCategory
    )
  }

  onChange = ({target: {name, value}}) => {
    const changes = {}

    if (name === 'cpc') {
      changes[name] = value
    } else {
      const dimension = {[name]: value}

      if (name === 'type') {
        dimension.productDimensionType = productScopeTypes[value].scopeClass
        dimension.value = ''
      }

      changes.dimension = dimension
    }

    this.props.update(this.self(), changes)
  }

  self () {
    return get(this.props, `parent.children.${this.props.id}`)
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
    const {dimension, children, cpc, type} = this.props
    const isUnit = type === 'UNIT'
    const isOther = this.isOtherPartition()
    const editable = (
      !this.isRoot() &&
      !(isOther && !isUnit) &&
      !(this.isCategory() && hasCategoryChild(children))
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

        {isUnit && (
          <a className={style.action} href='' onClick={this.onClickAdd}>
            <i className='material-icons'>add</i>
          </a>)}

        {!this.isRoot() && (
          <a className={style.action} href='' onClick={this.onClickRemove}>
            <i className='material-icons'>close</i>
          </a>)}

        {editable && this.state.openEditor && (
          <Modal size='small' minHeight={0} onEscPress={this.toggleEditor}>
            <DimensionEditor
              isOther={isOther}
              isUnit={isUnit}
              title={title}
              cpc={cpc}
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
