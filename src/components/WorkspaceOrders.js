import React from 'react'
import {contextualize} from './higher-order/contextualize'
import Orders from './Orders'

const {PropTypes} = React

export const WorkspaceOrders = React.createClass({
  displayName: 'Workspace-Orders',
  propTypes: {
    dispatch: PropTypes.func.isRequired,
    workspace: PropTypes.shape({
      orders: PropTypes.array
    }).isRequired
  },
  render () {
    const {dispatch, workspace: {orders}} = this.props

    return <Orders dispatch={dispatch} orders={orders}/>
  }
})

export default contextualize(WorkspaceOrders, 'workspace')
