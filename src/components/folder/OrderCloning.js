import React from 'react'
import PropTypes from 'prop-types'
import OrdersClone from '../order/list/Cloner'
import {routeParamsBasedBranch} from '../higher-order/branch'

export const Orders = ({folder: {orders}}) =>
  <OrdersClone orders={orders}/>

Orders.displayName = 'Folder-Orders-Cloning'
Orders.propTypes = {
  folder: PropTypes.shape({
    orders: PropTypes.array
  })
}

export default routeParamsBasedBranch('workspace', 'folder', Orders)
