import React from 'react'
import PropTypes from 'prop-types'
import OrdersClone from '../order/list/Cloner'
import {routeParamsBasedBranch} from '../higher-order/branch'

export const Orders = ({workspace: {orders}}) =>
  <OrdersClone orders={orders}/>

Orders.displayName = 'Workspace-Orders-Cloning'
Orders.propTypes = {
  workspace: PropTypes.shape({
    orders: PropTypes.array
  })
}

export default routeParamsBasedBranch('company', 'workspace', Orders)
