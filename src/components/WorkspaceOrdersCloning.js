import React from 'react'
import {contextualize} from './higher-order/contextualize'
import OrdersClone from './OrdersClone'

const {PropTypes} = React

export const Orders = React.createClass({
  displayName: 'Orders',
  propTypes: {
    workspace: PropTypes.shape({
      orders: PropTypes.array
    })
  },
  render () {
    return <OrdersClone orders={this.props.workspace.orders}/>
  }
})

export default contextualize(Orders, 'workspace')
