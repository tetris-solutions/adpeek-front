import {GET} from '@tetris/http'
import {saveResponseTokenAsCookie} from '@tetris/front-server/lib/functions/save-token-as-cookie'
import {getApiFetchConfig} from '@tetris/front-server/lib/functions/get-api-fetch-config'
import {pushResponseErrorToState} from '@tetris/front-server/lib/functions/push-response-error-to-state'
import {saveCampaigns} from '../functions/save-campaigns'

export function loadCampaigns (id, includeAdsets = false, config) {
  let url = `${process.env.ADPEEK_API_URL}/folder/${id}/campaigns`

  if (includeAdsets) {
    url += '?include-adsets=true'
  }

  return GET(url, config)
}

export function loadCampaignsAction (tree, company, workspace, folder, includeAdsets = false, token = null) {
  return loadCampaigns(folder, includeAdsets, getApiFetchConfig(tree, token))
    .then(saveResponseTokenAsCookie)
    .then(saveCampaigns(tree, company, workspace, folder))
    .catch(pushResponseErrorToState(tree))
}

export function loadCampaignsActionServerAdaptor ({authToken, params: {company, workspace, folder}}, res, includeAdsets = false) {
  return loadCampaignsAction(res.locals.tree, company, workspace, folder, includeAdsets, authToken)
}

export function loadCampaignsActionRouterAdaptor ({params: {company, workspace, folder}}, tree, includeAdsets = false) {
  return loadCampaignsAction(tree, company, workspace, folder, includeAdsets)
}
