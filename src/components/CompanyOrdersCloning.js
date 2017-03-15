import React from 'react'
import OrdersClone from './OrdersClone'
import {node} from './higher-order/branch'

const Orders = ({company: {orders}}) =>
  <OrdersClone orders={orders}/>

Orders.displayName = 'Company-Orders-Cloning'
Orders.propTypes = {
  company: React.PropTypes.shape({
    orders: React.PropTypes.array
  })
}

export default node('user', 'company', Orders)
