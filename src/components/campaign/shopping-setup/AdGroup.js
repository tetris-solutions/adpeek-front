import React from 'react'
import PropTypes from 'prop-types'
import {node} from '../../higher-order/branch'
import {loadAdGroupPartitionsAction} from '../../../actions/load-adgroup-partitions'
import once from 'lodash/once'

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
    if (this.state.open && !this.partitionsReady()) {
      this.loadPartitions()
    }
  }

  partitionsReady () {
    return Boolean(this.props.adGroup.partitions)
  }

  toggle = () => {
    this.setState({open: !this.state.open})
  }

  loadPartitions = once(() =>
    this.props.dispatch(
      loadAdGroupPartitionsAction,
      this.props.params))

  render () {
    return (
      <div>
        <a onClick={this.toggle}>
          <i className='material-icons'>keyboard_arrow_right</i>
        </a>

        <strong>{this.props.adGroup.name}</strong>
      </div>
    )
  }
}

export default node('campaign', 'adGroup', AdGroup)
