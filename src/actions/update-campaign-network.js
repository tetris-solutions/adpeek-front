import {PUT} from '@tetris/http'
import assign from 'lodash/assign'
import {saveResponseTokenAsCookie, getApiFetchConfig, pushResponseErrorToState} from 'tetris-iso/utils'
import {getDeepCursor} from '../functions/get-deep-cursor'

function updateCampaignNetwork (id, network, config) {
  return PUT(`${process.env.ADPEEK_API_URL}/campaign/${id}/network`, assign({body: network}, config))
}

export function updateCampaignNetworkAction (tree, {company, workspace, folder, campaign}, network) {
  return updateCampaignNetwork(campaign, network, getApiFetchConfig(tree))
    .then(saveResponseTokenAsCookie)
    .then(response => {
      const path = getDeepCursor(tree, [
        'user',
        ['companies', company],
        ['workspaces', workspace],
        ['folders', folder],
        ['campaigns', campaign],
        'details'
      ])
      tree.merge(path, network)

      return response
    })
    .catch(pushResponseErrorToState(tree))
}

