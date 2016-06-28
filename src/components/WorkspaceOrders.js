import React from 'react'
import {contextualize} from './higher-order/contextualize'
import Orders from './Orders'

const {PropTypes} = React

export const WorkspaceOrders = React.createClass({
  displayName: 'Workspace-Orders',
  propTypes: {
    workspace: PropTypes.shape({
      orders: PropTypes.array
    })
  },
  render () {
    return <Orders orders={this.props.workspace.orders}/>
  }
})

export default contextualize(WorkspaceOrders, 'workspace')
