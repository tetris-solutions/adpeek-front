import {saveResponseTokenAsCookie, getApiFetchConfig, pushResponseErrorToState} from '@tetris/front-server/utils'
import {GET} from '@tetris/http'

import {saveCampaigns} from '../functions/save-campaigns'

function loadFolderCampaigns (id, queryFlag = false, config) {
  let url = `${process.env.ADPEEK_API_URL}/folder/${id}/campaigns`

  if (queryFlag) {
    url += `?${queryFlag}=true`
  }

  return GET(url, config)
}

export function loadFolderCampaignsAction (tree, company, workspace, folder, queryFlag = false, token = null) {
  return loadFolderCampaigns(folder, queryFlag, getApiFetchConfig(tree, token))
    .then(saveResponseTokenAsCookie)
    .then(saveCampaigns(tree, company, workspace, folder))
    .catch(pushResponseErrorToState(tree))
}

export function loadFolderCampaignsActionServerAdaptor ({authToken, params: {company, workspace, folder}}, res, queryFlag = false) {
  return loadFolderCampaignsAction(res.locals.tree, company, workspace, folder, queryFlag, authToken)
}

export function loadFolderCampaignsActionRouterAdaptor ({params: {company, workspace, folder}}, tree, queryFlag = false) {
  return loadFolderCampaignsAction(tree, company, workspace, folder, queryFlag)
}
