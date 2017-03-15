import React from 'react'
import OrdersClone from './OrdersClone'
import {node} from './higher-order/branch'

export const Orders = ({folder: {orders}}) =>
  <OrdersClone orders={orders}/>

Orders.displayName = 'Folder-Orders-Cloning'
Orders.propTypes = {
  folder: React.PropTypes.shape({
    orders: React.PropTypes.array
  })
}

export default node('workspace', 'folder', Orders)
