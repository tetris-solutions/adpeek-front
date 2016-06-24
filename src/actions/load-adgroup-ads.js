import {GET} from '@tetris/http'
import {saveResponseTokenAsCookie} from '@tetris/front-server/lib/functions/save-token-as-cookie'
import {getApiFetchConfig} from '@tetris/front-server/lib/functions/get-api-fetch-config'
import {pushResponseErrorToState} from '@tetris/front-server/lib/functions/push-response-error-to-state'
import {saveResponseData} from '../functions/save-response-data'

export function loadCampaignAdGroupAds (campaign, adGroup, config) {
  return GET(`${process.env.ADPEEK_API_URL}/campaign/${campaign}/adgroup/${adGroup}/ads`, config)
}

export function loadCampaignAdGroupAdsAction (tree, company, workspace, folder, campaign, adGroup, token) {
  return loadCampaignAdGroupAds(campaign, adGroup, getApiFetchConfig(tree, token))
    .then(saveResponseTokenAsCookie)
    .then(saveResponseData(tree, [
      'user',
      ['companies', company],
      ['workspaces', workspace],
      ['folders', folder],
      ['campaigns', campaign],
      ['adGroups', adGroup],
      'ads'
    ]))
    .catch(pushResponseErrorToState(tree))
}
