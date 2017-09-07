import {PUT} from '@tetris/http'
import assign from 'lodash/assign'
import {saveResponseTokenAsCookie, getApiFetchConfig, pushResponseErrorToState} from '@tetris/front-server/utils'

function updateCampaignBidStrategy (id, bidStrategy, config) {
  return PUT(`${process.env.ADPEEK_API_URL}/campaign/${id}/bid-strategy`, assign({body: bidStrategy}, config))
}

export function updateCampaignBidStrategyAction (tree, {campaign}, bidStrategy) {
  return updateCampaignBidStrategy(campaign, bidStrategy, getApiFetchConfig(tree))
    .then(saveResponseTokenAsCookie)
    .catch(pushResponseErrorToState(tree))
}
