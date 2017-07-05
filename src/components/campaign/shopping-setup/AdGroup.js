import React from 'react'
import PropTypes from 'prop-types'
import {node} from '../../higher-order/branch'
import {loadAdGroupPartitionsAction} from '../../../actions/load-adgroup-partitions'
import once from 'lodash/once'
import forEach from 'lodash/forEach'
import filter from 'lodash/filter'
import assign from 'lodash/assign'
import find from 'lodash/find'

const isCategory = partition => (
  partition.dimension &&
  partition.dimension.ProductDimensionType === 'ProductBiddingCategory' &&
  Boolean(partition.dimension.value)
)

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

  state = {
    open: false
  }

  componentDidUpdate () {
    this.check()
  }

  check () {
    if (!this.state.open) return

    if (!this.partitionsReady()) {
      return this.loadPartitions()
    }

    if (!this.state.tree) {
      this.mountTree()
    }
  }

  partitionsReady () {
    return Boolean(this.props.adGroup.partitions)
  }

  mountTree () {
    const {adGroup: {partitions}, categories} = this.props

    const metaData = ({dimension: {value}}) => find(categories, {value})

    function makeBranch (partition) {
      const branch = assign({children: {}}, partition)

      if (isCategory(branch)) {
        branch.dimension = assign({},
          metaData(partition),
          partition.dimension)
      }

      return branch
    }

    const mount = (partitions, parent) =>
      forEach(filter(partitions, {parent: parent.id}), leaf => {
        leaf = makeBranch(leaf)

        parent.children[leaf.id] = leaf

        mount(partitions, leaf)
      })

    const tree = makeBranch(find(partitions, {parent: null}))

    mount(partitions, tree)

    this.setState({tree})
  }

  onClickToggle = e => {
    e.preventDefault()

    this.setState({
      open: !this.state.open
    })
  }

  loadPartitions = once(() =>
    this.props.dispatch(
      loadAdGroupPartitionsAction,
      this.props.params))

  render () {
    return (
      <div>
        <a href='' onClick={this.onClickToggle}>
          <i className='material-icons'>
            keyboard_arrow_right
          </i>
        </a>

        <strong>
          {this.props.adGroup.name}
        </strong>
      </div>
    )
  }
}

export default node('campaign', 'adGroup', AdGroup)
