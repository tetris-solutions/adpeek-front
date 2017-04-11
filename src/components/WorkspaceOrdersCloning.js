import React from 'react'
import PropTypes from 'prop-types'
import OrdersClone from './OrdersClone'
import {node} from './higher-order/branch'

export const Orders = ({workspace: {orders}}) =>
  <OrdersClone orders={orders}/>

Orders.displayName = 'Workspace-Orders-Cloning'
Orders.propTypes = {
  workspace: PropTypes.shape({
    orders: PropTypes.array
  })
}

export default node('company', 'workspace', Orders)
