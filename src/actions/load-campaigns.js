import {GET} from '@tetris/http'
import {saveResponseTokenAsCookie} from '@tetris/front-server/lib/functions/save-token-as-cookie'
import {getApiFetchConfig} from '@tetris/front-server/lib/functions/get-api-fetch-config'
import {pushResponseErrorToState} from '@tetris/front-server/lib/functions/push-response-error-to-state'
import {saveCampaigns} from '../functions/save-campaigns'

export function loadCampaigns (id, config) {
  return GET(`${process.env.ADPEEK_API_URL}/folder/${id}/campaigns`, config)
}

export function loadCampaignsAction (tree, company, workspace, folder, token) {
  return loadCampaigns(folder, getApiFetchConfig(tree, token))
    .then(saveResponseTokenAsCookie)
    .then(saveCampaigns(tree, company, workspace, folder))
    .catch(pushResponseErrorToState(tree))
}

export function loadCampaignsActionServerAdaptor ({authToken, params: {company, workspace, folder}}, res) {
  return loadCampaignsAction(res.locals.tree, company, workspace, folder, authToken)
}

export function loadCampaignsActionRouterAdaptor ({params: {company, workspace, folder}}, tree) {
  return loadCampaignsAction(tree, company, workspace, folder)
}
