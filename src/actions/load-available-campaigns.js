import {GET} from '@tetris/http'
import {saveResponseTokenAsCookie} from '@tetris/front-server/lib/functions/save-token-as-cookie'
import {getApiFetchConfig} from '@tetris/front-server/lib/functions/get-api-fetch-config'
import {pushResponseErrorToState} from '@tetris/front-server/lib/functions/push-response-error-to-state'
import {saveResponseData} from '../functions/save-response-data'

export function loadAvailableCampaigns (id, config) {
  return GET(`${process.env.ADPEEK_API_URL}/folder/${id}/campaigns/all`, config)
}

export function loadAvailableCampaignsAction (tree, company, workspace, folder, token) {
  return loadAvailableCampaigns(folder, getApiFetchConfig(tree, token))
    .then(saveResponseTokenAsCookie)
    .then(saveResponseData(tree, [
      'user',
      ['companies', company],
      ['workspaces', workspace],
      ['folders', folder],
      'availableCampaigns'
    ]))
    .catch(pushResponseErrorToState(tree))
}

export function loadAvailableCampaignsActionServerAdaptor ({authToken, params: {company, workspace, folder}}, res) {
  return loadAvailableCampaignsAction(res.locals.tree, company, workspace, folder, authToken)
}

export function loadAvailableCampaignsActionRouterAdaptor ({params: {company, workspace, folder}}, tree) {
  return loadAvailableCampaignsAction(tree, company, workspace, folder)
}
