import {PUT} from '@tetris/http'
import assign from 'lodash/assign'
import {saveResponseTokenAsCookie, getApiFetchConfig, pushResponseErrorToState} from '@tetris/front-server/utils'
import {getDeepCursor} from '../functions/get-deep-cursor'
import {statusResolver} from '../functions/status-resolver'

function updateCampaignStatus (id, status, config) {
  return PUT(`${process.env.ADPEEK_API_URL}/campaign/${id}/status`, assign({body: {status}}, config))
}

export function updateCampaignStatusAction (tree, {company, workspace, folder, campaign}, status) {
  return updateCampaignStatus(campaign, status, getApiFetchConfig(tree))
    .then(saveResponseTokenAsCookie)
    .then(response => {
      const campaignPath = getDeepCursor(tree, [
        'user',
        ['companies', company],
        ['workspaces', workspace],
        ['folders', folder],
        ['campaigns', campaign]
      ])

      const updatedCampaign = assign({}, tree.get(campaignPath), {status})
      const campaignStatusResolver = statusResolver(tree.get('statuses'))

      tree.set(campaignPath, campaignStatusResolver(updatedCampaign))

      return response
    })
    .catch(pushResponseErrorToState(tree))
}
