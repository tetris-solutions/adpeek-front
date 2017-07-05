import React from 'react'
import PropTypes from 'prop-types'
import {node} from '../../higher-order/branch'
import {loadAdGroupPartitionsAction} from '../../../actions/load-adgroup-partitions'
import once from 'lodash/once'
import forEach from 'lodash/forEach'
import filter from 'lodash/filter'
import assign from 'lodash/assign'
import find from 'lodash/find'
import {Tree, Node} from '../../Tree'
import PartitionBranch from './PartitionBranch'

const isCategory = partition => (
  partition.dimension &&
  partition.dimension.ProductDimensionType === 'ProductBiddingCategory' &&
  Boolean(partition.dimension.value)
)

const defaultRoot = {
  id: Math.random().toString(36).substr(2),
  children: {},
  dimension: null,
  parent: null
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
    const {adGroup: {partitions}, categories} = this.props

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

  load = once(() => {
    if (!this.partitionsReady()) {
      this.props.dispatch(loadAdGroupPartitionsAction, this.props.params)
    }
  })

  render () {
    const {adGroup, categories} = this.props

    return (
      <Node ref='node' onOpen={this.load} label={adGroup.name}>
        <Tree>
          <PartitionBranch categories={categories} {...this.state.tree}/>
        </Tree>
      </Node>
    )
  }
}

export default node('campaign', 'adGroup', AdGroup)
