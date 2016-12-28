import React from 'react'
import {contextualize} from './higher-order/contextualize'
import Orders from './Orders'

export const WorkspaceOrders = React.createClass({
  displayName: 'Workspace-Orders',
  propTypes: {
    dispatch: React.PropTypes.func.isRequired,
    workspace: React.PropTypes.shape({
      orders: React.PropTypes.array
    }).isRequired
  },
  render () {
    const {dispatch, workspace: {orders}} = this.props

    return <Orders dispatch={dispatch} orders={orders}/>
  }
})

export default contextualize(WorkspaceOrders, 'workspace')
