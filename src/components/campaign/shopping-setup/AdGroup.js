import React from 'react'
import PropTypes from 'prop-types'
import Message from 'tetris-iso/Message'
import {routeParamsBasedBranch} from '../../higher-order/branch'
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
import {productScopeTypes, productScopeClasses} from './types'
import omit from 'lodash/omit'
import debounce from 'lodash/debounce'
import random from 'lodash/random'
import isEmpty from 'lodash/isEmpty'

const aNull = field => ({[field]: null})
const valueFields = ['value', 'channel', 'channelExclusivity', 'condition']
const nullifiedValues = assign({}, ...map(valueFields, aNull))

const isCategory = partition => (
  partition.dimension &&
  partition.dimension.ProductDimensionType === 'ProductBiddingCategory' &&
  Boolean(partition.dimension.value)
)

const genTempId = () => String(0 - random(Math.pow(10, 6), Math.pow(10, 12)))

const newUnit = parent => ({
  id: genTempId(),
  lastUpdate: Date.now(),
  cpc: 0.01,
  children: {},
  type: 'UNIT',
  dimension: null,
  parent
})

function normalize (partition) {
  partition = assign({}, partition)

  partition.id = String(partition.id)

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

function flagAsChanged (node) {
  node.lastUpdate = Date.now()

  const alreadyTempNode = Number(node.id) < 0

  if (alreadyTempNode) return

  const oldId = node.id
  node.id = genTempId()

  if (node.parent) {
    delete node.parent.children[oldId]
    node.parent.children[node.id] = node
  }

  forEach(node.children, flagAsChanged)
}

const isOther = ({dimension}) => (
  dimension &&
  dimension[productScopeTypes[dimension.type].valueField] === null
)

const findOtherPartition = node => node.parent
  ? find(node.parent.children, isOther)
  : null

function mountTree (partitions, categories) {
  const metaData = ({dimension: {value}}) => find(categories, {value})

  function makeNode (partition, parent) {
    const branch = assign({}, partition, {children: {}, parent})

    if (branch.dimension) {
      branch.dimension = assign({
        type: productScopeClasses[branch.dimension.ProductDimensionType].defaultType
      }, branch.dimension)
    }

    if (isCategory(branch)) {
      branch.dimension = assign({}, metaData(partition), branch.dimension)
    }

    if (parent) {
      parent.children[branch.id] = branch
    }

    return branch
  }

  function makeBranch (parent) {
    function descend (leaf) {
      makeBranch(makeNode(leaf, parent))
    }

    forEach(filter(partitions, {parent: parent.id}), descend)
  }

  const tree = makeNode(find(partitions, {parent: null}), null)

  makeBranch(tree)

  return tree
}

function apply (node, changes, skipOther = false) {
  if (!node) return

  const dimensionChanges = changes.dimension

  if (dimensionChanges) {
    if (!skipOther && dimensionChanges.type) {
      apply(findOtherPartition(node), {
        dimension: assign({}, dimensionChanges, nullifiedValues)
      }, true)
    }

    assign(node.dimension, dimensionChanges)
    changes = omit(changes, 'dimension')
  }

  flagAsChanged(node)
  assign(node, changes)
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
    const source = this.props.adGroup.partitions

    const partitions = map(
      isEmpty(source) ? [newUnit(null)] : source,
      normalize
    )

    this.setState({
      tree: mountTree(partitions, this.props.categories)
    })
  }

  persist = debounce(() => {
    this.props.dispatch(liveEditAdGroupAction, this.props.params, {
      partitions: flattenPartition(this.state.tree)
    })
  }, 1000)

  refresh () {
    this.setState({
      tree: this.state.tree
    }, this.persist)
  }

  update = (node, changes) => {
    node = node || this.state.tree
    // @todo avoid mutability

    if (changes === null) {
      apply(node.parent, {
        children: {},
        type: 'UNIT'
      })
    } else {
      apply(node, changes)
    }

    this.refresh()
  }

  appendChild = (parent) => {
    parent = parent || this.state.tree

    const child = newUnit(parent)
    const other = newUnit(parent)

    // @todo adapt for non-binary trees

    child.dimension = {
      ProductDimensionType: 'ProductOfferId',
      type: 'OFFER_ID',
      value: ''
    }

    other.dimension = assign({},
      child.dimension,
      nullifiedValues
    )

    apply(parent, {
      children: {
        [child.id]: child,
        [other.id]: other
      },
      type: 'SUBDIVISION'
    })

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

export default routeParamsBasedBranch('campaign', 'adGroup', AdGroup)
