import {GET} from '@tetris/http'
import {saveResponseTokenAsCookie, getApiFetchConfig, pushResponseErrorToState} from '@tetris/front-server/utils'
import {saveResponseData} from '../functions/save-response-data'

function loadCampaignDetails (campaign, fresh, config) {
  return GET(`${process.env.ADPEEK_API_URL}/campaign/${campaign}/details${fresh ? '?fresh=true' : ''}`, config)
}

export function loadCampaignDetailsAction (tree, {company, workspace, folder, campaign}, fresh = false) {
  return loadCampaignDetails(campaign, fresh, getApiFetchConfig(tree))
    .then(saveResponseTokenAsCookie)
    .then(saveResponseData(tree, [
      'user',
      ['companies', company],
      ['workspaces', workspace],
      ['folders', folder],
      ['campaigns', campaign],
      'details'
    ]))
    .catch(pushResponseErrorToState(tree))
}
