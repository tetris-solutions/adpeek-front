import React from 'react'
import PropTypes from 'prop-types'
import {node} from '../../higher-order/branch'
import {loadAdGroupPartitionsAction} from '../../../actions/load-adgroup-partitions'
import once from 'lodash/once'
import forEach from 'lodash/forEach'
import filter from 'lodash/filter'
import assign from 'lodash/assign'
import find from 'lodash/find'

const make = node => assign({children: {}}, node)

const mount = (partitions, node) =>
  forEach(filter(partitions, {parent: node.id}), leaf => {
    leaf = make(leaf)

    node.children[leaf.id] = leaf

    mount(partitions, leaf)
  })

class AdGroup extends React.Component {
  static displayName = 'AdGroup'

  static propTypes = {
    dispatch: PropTypes.func,
    params: PropTypes.object,
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
    const {partitions} = this.props.adGroup
    const tree = make(find(partitions, {parent: null}))

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
