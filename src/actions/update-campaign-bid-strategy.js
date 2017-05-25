import {PUT} from '@tetris/http'
import assign from 'lodash/assign'
import {saveResponseTokenAsCookie, getApiFetchConfig, pushResponseErrorToState} from 'tetris-iso/utils'

function updateCampaignBidStrategy (id, network, config) {
  return PUT(`${process.env.ADPEEK_API_URL}/campaign/${id}/bid-strategy`, assign({body: network}, config))
}

export function updateCampaignBidStrategyAction (tree, {campaign}, bidStrategy) {
  return updateCampaignBidStrategy(campaign, bidStrategy, getApiFetchConfig(tree))
    .then(saveResponseTokenAsCookie)
    .catch(pushResponseErrorToState(tree))
}

