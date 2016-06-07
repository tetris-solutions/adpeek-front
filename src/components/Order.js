import React from 'react'
import {contextualize} from './higher-order/contextualize'
import OrderController from './OrderController'
import Message from 'intl-messageformat'
import upperFirst from 'lodash/upperFirst'

const {PropTypes} = React

export function Order ({deliveryMethods, dispatch, params, order, folder}, {messages: {newOrderName}, moment, locales}) {
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

  order = order || defaultOrder()

  return (
    <OrderController
      key={params.order || 'new-order'}
      params={params}
      deliveryMethods={deliveryMethods}
      dispatch={dispatch}
      campaigns={folder.campaigns}
      order={order}/>
  )
}

Order.displayName = 'Order'
Order.propTypes = {
  dispatch: PropTypes.func,
  deliveryMethods: PropTypes.array,
  params: PropTypes.object,
  folder: PropTypes.object,
  order: PropTypes.any
}
Order.contextTypes = {
  moment: PropTypes.func,
  locales: PropTypes.string,
  messages: PropTypes.object
}

export default contextualize(Order, {deliveryMethods: ['deliveryMethods']}, 'folder', 'order')
