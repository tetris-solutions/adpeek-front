import React from 'react'
import {contextualize} from './higher-order/contextualize'
import OrderController from './OrderController'
import Message from 'intl-messageformat'
import upperFirst from 'lodash/upperFirst'
import flatten from 'lodash/flatten'
import map from 'lodash/map'
import assign from 'lodash/assign'

const {PropTypes} = React

function normalizeCampaign (campaign) {
  function normalizeAdset (adset) {
    const defaults = {
      id: `external::${adset.external_id}`,
      campaign: campaign.id,
      status: campaign.status
    }
    return assign(defaults, adset)
  }

  return map(campaign.adsets, normalizeAdset)
}

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
  const adsetMode = folder.account.platform === 'facebook'

  return (
    <OrderController
      key={params.order || 'new-order'}
      params={params}
      deliveryMethods={deliveryMethods}
      dispatch={dispatch}
      maxCampaignsPerBudget={adsetMode ? 1 : Infinity}
      campaigns={adsetMode ? flatten(map(folder.campaigns, normalizeCampaign)) : folder.campaigns}
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
