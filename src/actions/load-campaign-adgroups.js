import {GET} from '@tetris/http'
import {saveResponseTokenAsCookie, getApiFetchConfig, pushResponseErrorToState} from '@tetris/front-server/utils'
import {saveResponseData} from '../functions/save-response-data'

function loadCampaignAdGroups (campaign, config) {
  return GET(`${process.env.ADPEEK_API_URL}/campaign/${campaign}/adGroups`, config)
}

export function loadCampaignAdGroupsAction (tree, {company, workspace, folder, campaign}, token) {
  return loadCampaignAdGroups(campaign, getApiFetchConfig(tree, token))
    .then(saveResponseTokenAsCookie)
    .then(saveResponseData(tree, [
      'user',
      ['companies', company],
      ['workspaces', workspace],
      ['folders', folder],
      ['campaigns', campaign],
      'adGroups'
    ]))
    .catch(pushResponseErrorToState(tree))
}
