import React from 'react'
import PropTypes from 'prop-types'
import OrdersClone from '../order/list/Cloner'
import {routeParamsBasedBranch} from '../higher-order/branch'

const Orders = ({company: {orders}}) =>
  <OrdersClone orders={orders}/>

Orders.displayName = 'Company-Orders-Cloning'
Orders.propTypes = {
  company: PropTypes.shape({
    orders: PropTypes.array
  })
}

export default routeParamsBasedBranch('user', 'company', Orders)
