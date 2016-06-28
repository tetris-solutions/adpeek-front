import React from 'react'
import {contextualize} from './higher-order/contextualize'
import Orders from './Orders'

const {PropTypes} = React

export const CompanyOrders = React.createClass({
  displayName: 'Company-Orders',
  propTypes: {
    company: PropTypes.shape({
      orders: PropTypes.array
    })
  },
  render () {
    return <Orders orders={this.props.company.orders}/>
  }
})

export default contextualize(CompanyOrders, 'company')
