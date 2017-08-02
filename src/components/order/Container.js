import React from 'react'
import PropTypes from 'prop-types'
import {many} from '../higher-order/branch'
import OrderController from './Controller'
import Message from 'intl-messageformat'
import upperFirst from 'lodash/upperFirst'
import flatten from 'lodash/flatten'
import map from 'lodash/map'
import assign from 'lodash/assign'
import filter from 'lodash/filter'
import findLast from 'lodash/findLast'
import includes from 'lodash/includes'

const notAdwordsVideo = ({is_adwords_video}) => !is_adwords_video

function normalizeAdset (adset) {
  return assign({id: `external::${adset.external_id}`}, adset)
}

function getCampaignAdsets (campaign) {
  return map(campaign.adsets, normalizeAdset)
}

const isOrderRoute = ({path}) => includes(path, 'order')

class Order extends React.PureComponent {
  static displayName = 'Order'

  static propTypes = {
    routes: PropTypes.array,
    statuses: PropTypes.array,
    dispatch: PropTypes.func,
    deliveryMethods: PropTypes.array,
    params: PropTypes.object,
    folder: PropTypes.object,
    order: PropTypes.any
  }

  static contextTypes = {
    moment: PropTypes.func,
    locales: PropTypes.string,
    messages: PropTypes.object
  }

  getDefaultOrder () {
    const {messages: {newOrderName}, moment, locales} = this.context
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

  render () {
    const {deliveryMethods, dispatch, params, folder, routes} = this.props
    const order = this.props.order || this.getDefaultOrder()
    const adSetMode = folder.account.platform === 'facebook'
    const folderCampaigns = filter(folder.campaigns, notAdwordsVideo)
    const campaigns = adSetMode
      ? flatten(map(folderCampaigns, getCampaignAdsets))
      : folderCampaigns

    return (
      <OrderController
        route={findLast(routes, isOrderRoute)}
        key={params.order || 'new-order'}
        params={params}
        deliveryMethods={deliveryMethods}
        dispatch={dispatch}
        campaigns={campaigns}
        order={order}/>
    )
  }
}

export default many([
  {deliveryMethods: ['deliveryMethods']},
  ['workspace', 'folder'],
  ['folder', 'order']
], Order)
