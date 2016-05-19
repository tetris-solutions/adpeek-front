import React from 'react'
import find from 'lodash/find'
import {contextualize} from './higher-order/contextualize'
import OrderController from './OrderController'
import Message from 'intl-messageformat'
import upperFirst from 'lodash/upperFirst'

const {PropTypes} = React

export function Order ({params, folder: {campaigns, orders}}, {messages: {newOrderName}, moment, locales}) {
  const defaultOrder = () => {
    const nextMonth = moment().add(1, 'month')
    return {
      name: new Message(newOrderName, locales).format({month: upperFirst(nextMonth.format('MMMM, YY'))}),
      start: nextMonth.date(1).format('YYYY-MM-DD'),
      end: nextMonth.add(1, 'month').date(0).format('YYYY-MM-DD'),
      auto_budget: true,
      amount: 1000,
      budgets: []
    }
  }

  const order = find(orders, {id: params.order}) || defaultOrder()

  return (
    <OrderController
      key={order.id || 'new-order'}
      params={params}
      campaigns={campaigns}
      order={order}/>
  )
}

Order.displayName = 'Order'
Order.propTypes = {
  params: PropTypes.object,
  folder: PropTypes.object
}
Order.contextTypes = {
  moment: PropTypes.func,
  locales: PropTypes.string,
  messages: PropTypes.object
}

export default contextualize(Order, 'folder')
