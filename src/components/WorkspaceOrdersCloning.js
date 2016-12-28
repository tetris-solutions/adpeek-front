import React from 'react'
import {contextualize} from './higher-order/contextualize'
import OrdersClone from './OrdersClone'

export const Orders = React.createClass({
  displayName: 'Orders',
  propTypes: {
    workspace: React.PropTypes.shape({
      orders: React.PropTypes.array
    })
  },
  render () {
    return <OrdersClone orders={this.props.workspace.orders}/>
  }
})

export default contextualize(Orders, 'workspace')
