import React from 'react'
import PropTypes from 'prop-types'
import OrdersClone from '../OrdersClone'
import {node} from '../higher-order/branch'

export const Orders = ({folder: {orders}}) =>
  <OrdersClone orders={orders}/>

Orders.displayName = 'Folder-Orders-Cloning'
Orders.propTypes = {
  folder: PropTypes.shape({
    orders: PropTypes.array
  })
}

export default node('workspace', 'folder', Orders)
