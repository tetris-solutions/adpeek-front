import {PUT} from '@tetris/http'
import assign from 'lodash/assign'
import {saveResponseTokenAsCookie, getApiFetchConfig, pushResponseErrorToState} from 'tetris-iso/utils'
import {getDeepCursor} from '../functions/get-deep-cursor'

function updateCampaignName (id, name, config) {
  return PUT(`${process.env.ADPEEK_API_URL}/campaign/${id}/name`, assign({body: {name}}, config))
}

export function updateCampaignNameAction (tree, {company, workspace, folder, campaign}, name) {
  return updateCampaignName(campaign, name, getApiFetchConfig(tree))
    .then(saveResponseTokenAsCookie)
    .then(response => {
      const path = getDeepCursor(tree, [
        'user',
        ['companies', company],
        ['workspaces', workspace],
        ['folders', folder],
        ['campaigns', campaign],
        'name'
      ])
      tree.set(path, name)

      return response
    })
    .catch(pushResponseErrorToState(tree))
}

