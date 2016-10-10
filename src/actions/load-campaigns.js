import {saveResponseTokenAsCookie, getApiFetchConfig, pushResponseErrorToState} from 'tetris-iso/utils'
import {GET} from '@tetris/http'

import {saveCampaigns} from '../functions/save-campaigns'

export function loadCampaigns (id, queryFlag = false, config) {
  let url = `${process.env.ADPEEK_API_URL}/folder/${id}/campaigns`

  if (queryFlag) {
    url += `?${queryFlag}=true`
  }

  return GET(url, config)
}

export function loadCampaignsAction (tree, company, workspace, folder, queryFlag = false, token = null) {
  return loadCampaigns(folder, queryFlag, getApiFetchConfig(tree, token))
    .then(saveResponseTokenAsCookie)
    .then(saveCampaigns(tree, company, workspace, folder))
    .catch(pushResponseErrorToState(tree))
}

export function loadCampaignsActionServerAdaptor ({authToken, params: {company, workspace, folder}}, res, queryFlag = false) {
  return loadCampaignsAction(res.locals.tree, company, workspace, folder, queryFlag, authToken)
}

export function loadCampaignsActionRouterAdaptor ({params: {company, workspace, folder}}, tree, queryFlag = false) {
  return loadCampaignsAction(tree, company, workspace, folder, queryFlag)
}
