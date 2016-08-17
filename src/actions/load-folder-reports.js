import {GET} from '@tetris/http'
import {saveResponseTokenAsCookie} from '@tetris/front-server/lib/functions/save-token-as-cookie'
import {getApiFetchConfig} from '@tetris/front-server/lib/functions/get-api-fetch-config'
import {pushResponseErrorToState} from '@tetris/front-server/lib/functions/push-response-error-to-state'
import {saveResponseData} from '../functions/save-response-data'

export function loadFolderReports (id, limitToFirst = false, config) {
  let url = `${process.env.ADPEEK_API_URL}/folder/${id}/reports`

  if (limitToFirst) {
    url += '?limit=1'
  }

  return GET(url, config)
}

export function loadFolderReportsAction (tree, company, workspace, folder, limitToFirst = false, token = null) {
  return loadFolderReports(folder, limitToFirst, getApiFetchConfig(tree, token))
    .then(saveResponseTokenAsCookie)
    .then(saveResponseData(tree, [
      'user',
      ['companies', company],
      ['workspaces', workspace],
      ['folders', folder],
      'reports'
    ]))
    .catch(pushResponseErrorToState(tree))
}

export function loadFolderReportsActionServerAdaptor ({authToken, params: {company, workspace, folder}}, res, limitToFirst = false) {
  return loadFolderReportsAction(res.locals.tree, company, workspace, folder, limitToFirst, authToken)
}

export function loadFolderReportsActionRouterAdaptor ({params: {company, workspace, folder}}, tree, limitToFirst = false) {
  return loadFolderReportsAction(tree, company, workspace, folder, limitToFirst)
}