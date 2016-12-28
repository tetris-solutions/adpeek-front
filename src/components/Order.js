import React from 'react'
import {contextualize} from './higher-order/contextualize'
import OrderController from './OrderController'
import Message from 'intl-messageformat'
import upperFirst from 'lodash/upperFirst'
import flatten from 'lodash/flatten'
import map from 'lodash/map'
import assign from 'lodash/assign'
import filter from 'lodash/filter'
const notAdwordsVideo = ({is_adwords_video}) => !is_adwords_video

function normalizeAdset (adset) {
  return assign({id: `external::${adset.external_id}`}, adset)
}

function getCampaignAdsets (campaign) {
  return map(campaign.adsets, normalizeAdset)
}

export function Order ({deliveryMethods, dispatch, params, order, folder, statuses}, {messages: {newOrderName}, moment, locales}) {
  function defaultOrder () {
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
  const folderCampaigns = filter(folder.campaigns, notAdwordsVideo)
  const campaigns = adsetMode
    ? flatten(map(folderCampaigns, getCampaignAdsets))
    : folderCampaigns

  return (
    <OrderController
      key={params.order || 'new-order'}
      params={params}
      deliveryMethods={deliveryMethods}
      dispatch={dispatch}
      maxCampaignsPerBudget={adsetMode ? 1 : Infinity}
      campaigns={campaigns}
      order={order}/>
  )
}

Order.displayName = 'Order'
Order.propTypes = {
  statuses: React.PropTypes.array,
  dispatch: React.PropTypes.func,
  deliveryMethods: React.PropTypes.array,
  params: React.PropTypes.object,
  folder: React.PropTypes.object,
  order: React.PropTypes.any
}
Order.contextTypes = {
  moment: React.PropTypes.func,
  locales: React.PropTypes.string,
  messages: React.PropTypes.object
}

export default contextualize(Order, {deliveryMethods: ['deliveryMethods'], statuses: ['statuses']}, 'folder', 'order')
