import React from 'react'
import {contextualize} from './higher-order/contextualize'
import Orders from './Orders'

const {PropTypes} = React

export const CompanyOrders = React.createClass({
  displayName: 'Company-Orders',
  propTypes: {
    dispatch: PropTypes.func.isRequired,
    company: PropTypes.shape({
      orders: PropTypes.array
    }).isRequired
  },
  render () {
    const {dispatch, company: {orders}} = this.props

    return <Orders dispatch={dispatch} orders={orders}/>
  }
})

export default contextualize(CompanyOrders, 'company')
