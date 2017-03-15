import React from 'react'
import OrdersClone from './OrdersClone'
import {node} from './higher-order/branch'

export const Orders = ({workspace: {orders}}) =>
  <OrdersClone orders={orders}/>

Orders.displayName = 'Workspace-Orders-Cloning'
Orders.propTypes = {
  workspace: React.PropTypes.shape({
    orders: React.PropTypes.array
  })
}

export default node('company', 'workspace', Orders)
