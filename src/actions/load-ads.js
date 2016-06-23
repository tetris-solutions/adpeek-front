import {GET} from '@tetris/http'
import {saveResponseTokenAsCookie} from '@tetris/front-server/lib/functions/save-token-as-cookie'
import {getApiFetchConfig} from '@tetris/front-server/lib/functions/get-api-fetch-config'
import {pushResponseErrorToState} from '@tetris/front-server/lib/functions/push-response-error-to-state'
import {saveResponseData} from '../functions/save-response-data'

export function loadCampaignAds (campaign, config) {
  return GET(`${process.env.ADPEEK_API_URL}/campaign/${campaign}/ads`, config)
}

export function loadCampaignAdsAction (tree, company, workspace, folder, campaign, token) {
  return loadCampaignAds(campaign, getApiFetchConfig(tree, token))
    .then(saveResponseTokenAsCookie)
    .then(saveResponseData(tree, [
      'user',
      ['companies', company],
      ['workspaces', workspace],
      ['folders', folder],
      ['campaigns', campaign],
      'ads'
    ]))
    .catch(pushResponseErrorToState(tree))
}

export function loadCampaignAdsActionServerAdaptor (req, res) {
  return loadCampaignAdsAction(res.locals.tree,
    req.params.company,
    req.params.workspace,
    req.params.folder,
    req.params.campaign,
    req.authToken)
}

export function loadCampaignAdsActionRouterAdaptor (state, tree) {
  return loadCampaignAdsAction(tree,
    state.params.company,
    state.params.workspace,
    state.params.folder,
    state.params.campaign)
}
