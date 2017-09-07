import React from 'react'
import chunk from 'lodash/chunk'
import PropTypes from 'prop-types'
import {many} from '../higher-order/branch'
import {loadCampaignBiddingStrategyAction} from '../../actions/load-campaign-bidding-strategy'
import OrderController from './Controller'
import MessageFormat from 'intl-messageformat'
import Message from '@tetris/front-server/Message'
import upperFirst from 'lodash/upperFirst'
import flatten from 'lodash/flatten'
import map from 'lodash/map'
import assign from 'lodash/assign'
import filter from 'lodash/filter'
import findLast from 'lodash/findLast'
import includes from 'lodash/includes'
import Loading from '../LoadingHorizontal'
import Page from '../Page'
import SubHeader from '../SubHeader'
import isEmpty from 'lodash/isEmpty'

const notAdwordsVideo = ({is_adwords_video}) => !is_adwords_video
const needsBidStrategy = ({status: {status}, platform, biddingStrategy}) =>
  platform === 'adwords' &&
  status !== 'REMOVED' &&
  !biddingStrategy

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
    cursors: PropTypes.object,
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

  state = {
    isLoading: this.requiresBidStrategyLoad()
  }

  getCurrentFolder () {
    return this.props.cursors.folder
  }

  componentDidMount () {
    if (this.requiresBidStrategyLoad()) {
      this.loadBidStrategy()
    }
  }

  requiresBidStrategyLoad () {
    return !isEmpty(this.getCampaignsRequiringStrategy())
  }

  getCampaignsRequiringStrategy () {
    return filter(this.getCurrentFolder().campaigns,
      needsBidStrategy)
  }

  loadBidStrategy () {
    const {params, dispatch} = this.props
    const loadBidStrategy = ({id: campaign}) => dispatch(loadCampaignBiddingStrategyAction, assign({campaign}, params))
    const campaigns = this.getCampaignsRequiringStrategy()

    let promise = Promise.resolve()

    chunk(campaigns, 5).forEach(fiveCampaigns => {
      promise = promise.then(() => Promise.all(map(fiveCampaigns, loadBidStrategy)))
    })

    promise
      .then(() => this.setState({
        isLoading: false
      }))
  }

  getDefaultOrder () {
    const {messages: {newOrderName}, moment, locales} = this.context
    const nextMonth = moment().add(1, 'month')

    return {
      name: new MessageFormat(newOrderName, locales).format({month: upperFirst(nextMonth.format('MMMM, YY'))}),
      start: nextMonth.date(1).format('YYYY-MM-DD'),
      end: nextMonth.add(1, 'month').date(0).format('YYYY-MM-DD'),
      auto_budget: false,
      amount: 1000,
      budgets: []
    }
  }

  render () {
    if (this.state.isLoading) {
      return (
        <div>
          <SubHeader/>
          <Page>
            <Loading>
              <Message>loadingBidStrategies</Message>
            </Loading>
          </Page>
        </div>
      )
    }

    const {deliveryMethods, dispatch, params, routes} = this.props
    const folder = this.getCurrentFolder()
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
  ['folder', 'order'],
  ['workspace', 'folder']
], Order)
