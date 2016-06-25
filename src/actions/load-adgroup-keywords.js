import {GET} from '@tetris/http'
import {saveResponseTokenAsCookie} from '@tetris/front-server/lib/functions/save-token-as-cookie'
import {getApiFetchConfig} from '@tetris/front-server/lib/functions/get-api-fetch-config'
import {pushResponseErrorToState} from '@tetris/front-server/lib/functions/push-response-error-to-state'
import {saveResponseData} from '../functions/save-response-data'

export function loadCampaignAdGroupKeywords (campaign, adGroup, config) {
  return GET(`${process.env.ADPEEK_API_URL}/campaign/${campaign}/adgroup/${adGroup}/keywords`, config)
}

export function loadCampaignAdGroupKeywordsAction (tree, company, workspace, folder, campaign, adGroup, token) {
  return loadCampaignAdGroupKeywords(campaign, adGroup, getApiFetchConfig(tree, token))
    .then(saveResponseTokenAsCookie)
    .then(saveResponseData(tree, [
      'user',
      ['companies', company],
      ['workspaces', workspace],
      ['folders', folder],
      ['campaigns', campaign],
      ['adGroups', adGroup],
      'keywords'
    ]))
    .catch(pushResponseErrorToState(tree))
}
