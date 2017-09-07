import {PUT} from '@tetris/http'
import assign from 'lodash/assign'
import {saveResponseTokenAsCookie, getApiFetchConfig, pushResponseErrorToState} from '@tetris/front-server/utils'

function updateCampaignNetwork (id, network, config) {
  return PUT(`${process.env.ADPEEK_API_URL}/campaign/${id}/network`, assign({body: network}, config))
}

export function updateCampaignNetworkAction (tree, {campaign}, network) {
  return updateCampaignNetwork(campaign, network, getApiFetchConfig(tree))
    .then(saveResponseTokenAsCookie)
    .catch(pushResponseErrorToState(tree))
}
