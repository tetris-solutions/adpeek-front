import React from 'react'
import PropTypes from 'prop-types'
import Message from 'tetris-iso/Message'
import {node} from '../../higher-order/branch'
import {loadAdGroupPartitionsAction} from '../../../actions/load-adgroup-partitions'
import once from 'lodash/once'
import forEach from 'lodash/forEach'
import filter from 'lodash/filter'
import assign from 'lodash/assign'
import find from 'lodash/find'
import {Tree, Node} from '../../Tree'

const isCategory = partition => (
  partition.dimension &&
  partition.dimension.ProductDimensionType === 'ProductBiddingCategory' &&
  Boolean(partition.dimension.value)
)

const defaultRoot = {}

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

    function makeNode (partition) {
      const branch = assign({children: {}}, partition)

      if (isCategory(branch)) {
        branch.dimension = assign({},
          metaData(partition),
          partition.dimension)
      }

      return branch
    }

    const makeBranch = (partitions, parent) =>
      forEach(filter(partitions, {parent: parent.id}), leaf => {
        leaf = makeNode(leaf)

        parent.children[leaf.id] = leaf

        makeBranch(partitions, leaf)
      })

    const tree = makeNode(find(partitions, {parent: null}) || defaultRoot)

    makeBranch(partitions, tree)

    this.setState({tree})
  }

  load = once(() => {
    if (!this.partitionsReady()) {
      this.props.dispatch(loadAdGroupPartitionsAction, this.props.params)
    }
  })

  render () {
    return (
      <Node ref='node' onOpen={this.load} label={this.props.adGroup.name}>
        <Tree>
          <Node label={<Message>rootPartitionLabel</Message>}>
            {JSON.stringify(this.state.tree, null, 2)}
          </Node>
        </Tree>
      </Node>
    )
  }
}

export default node('campaign', 'adGroup', AdGroup)
