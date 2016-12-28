import React from 'react'
import {contextualize} from './higher-order/contextualize'
import Orders from './Orders'

export const CompanyOrders = React.createClass({
  displayName: 'Company-Orders',
  propTypes: {
    dispatch: React.PropTypes.func.isRequired,
    company: React.PropTypes.shape({
      orders: React.PropTypes.array
    }).isRequired
  },
  render () {
    const {dispatch, company: {orders}} = this.props

    return <Orders dispatch={dispatch} orders={orders}/>
  }
})

export default contextualize(CompanyOrders, 'company')
