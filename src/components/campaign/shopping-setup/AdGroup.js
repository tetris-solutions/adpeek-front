import React from 'react'
import PropTypes from 'prop-types'
import Message from 'tetris-iso/Message'
import {node} from '../../higher-order/branch'
import {loadAdGroupPartitionsAction} from '../../../actions/load-adgroup-partitions'
import {liveEditAdGroupAction} from '../../../actions/update-campaign-creatives'
import once from 'lodash/once'
import forEach from 'lodash/forEach'
import filter from 'lodash/filter'
import assign from 'lodash/assign'
import find from 'lodash/find'
import {Tree, Node} from '../../Tree'
import PartitionBranch from './PartitionBranch'
import map from 'lodash/map'
import {productScopeClasses} from './types'
import omit from 'lodash/omit'
import debounce from 'lodash/debounce'
import random from 'lodash/random'
import isEmpty from 'lodash/isEmpty'

const isCategory = partition => (
  partition.dimension &&
  partition.dimension.ProductDimensionType === 'ProductBiddingCategory' &&
  Boolean(partition.dimension.value)
)

const genTempId = () => String(0 - random(Math.pow(10, 6), Math.pow(10, 12)))

const defaultRoot = {
  id: genTempId(),
  draft: true,
  children: {},
  dimension: null,
  parent: null
}

function setTypeIfNone (partition) {
  partition = assign({}, partition)

  if (partition.dimension) {
    partition.dimension = assign({}, partition.dimension)
    partition.dimension.type = (
      partition.dimension.type ||
      productScopeClasses[partition.dimension.ProductDimensionType].defaultType
    )
  }

  return partition
}

function flattenPartition (node, partitions = []) {
  const partition = omit(node, 'parent', 'children')

  partition.parent = node.parent
    ? node.parent.id
    : null

  partition.dimension = partition.dimension
    ? assign({}, partition.dimension)
    : null

  partitions.push(partition)

  forEach(node.children, child =>
    flattenPartition(child, partitions))

  return partitions
}

function setPartitionType (node, type) {
  if (node.type === type) return

  node.type = type
  node.lastUpdate = Date.now()
}

function fixPartitionType (node) {
  if (isEmpty(node.children)) {
    setPartitionType(node, 'UNIT')
  } else {
    setPartitionType(node, 'SUBDIVISION')

    forEach(node.children, fixPartitionType)
  }
}

class AdGroup extends React.Component {
  static displayName = 'AdGroup'

  static propTypes = {
    dispatch: PropTypes.func,
    params: PropTypes.object,
    categories: PropTypes.array,
    adGroup: PropTypes.shape({
      id: PropTypes.string,
      name: PropTypes.string,
      partitions: PropTypes.array
    })
  }

  state = {tree: null}

  componentDidUpdate () {
    if (this.partitionsReady() && !this.state.tree) {
      this.mountTree()
    }
  }

  partitionsReady () {
    return Boolean(this.props.adGroup.partitions)
  }

  mountTree () {
    const partitions = map(this.props.adGroup.partitions, setTypeIfNone)
    const {categories} = this.props

    const metaData = ({dimension: {value}}) => find(categories, {value})

    function makeNode (partition, parent) {
      const branch = assign({}, partition, {children: {}, parent})

      if (isCategory(branch)) {
        branch.dimension = assign({},
          metaData(partition),
          partition.dimension)
      }

      if (parent) {
        parent.children[branch.id] = branch
      }

      return branch
    }

    const makeBranch = parent =>
      forEach(filter(partitions, {parent: parent.id}),
        leaf => makeBranch(makeNode(leaf, parent)))

    const tree = makeNode(
      find(partitions, {parent: null}) || defaultRoot
    )

    makeBranch(tree)

    this.setState({tree})
  }

  persist = debounce(() => {
    this.props.dispatch(liveEditAdGroupAction, this.props.params, {
      partitions: flattenPartition(this.state.tree)
    })
  }, 1000)

  refresh () {
    const {tree} = this.state

    fixPartitionType(tree)

    this.setState({tree}, this.persist)
  }

  update = (node, changes) => {
    // @todo avoid mutability

    if (changes === null) {
      delete node.parent.children[node.id]
    } else {
      node.lastUpdate = Date.now()
      assign(node.dimension, changes)
    }

    this.refresh()
  }

  appendChild = parent => {
    const id = genTempId()

    parent.children[id] = {
      id,
      draft: true,
      children: {},
      parent,
      dimension: {
        ProductDimensionType: 'ProductOfferId',
        type: 'OFFER_ID',
        value: ''
      }
    }

    this.refresh()
  }

  load = once(() => {
    if (!this.partitionsReady()) {
      this.props.dispatch(loadAdGroupPartitionsAction, this.props.params)
    }
  })

  render () {
    const {adGroup, categories} = this.props

    return (
      <Node ref='node' onOpen={this.load} label={adGroup.name}>
        {this.state.tree ? (
          <Tree>
            <PartitionBranch
              appendChild={this.appendChild}
              update={this.update}
              categories={categories}
              {...this.state.tree}/>
          </Tree>
        ) : (
          <p>
            <Message>loadingProductPartitions</Message>
          </p>
        )}
      </Node>
    )
  }
}

export default node('campaign', 'adGroup', AdGroup)
