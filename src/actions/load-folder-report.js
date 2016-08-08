import {GET} from '@tetris/http'
import {saveResponseTokenAsCookie} from '@tetris/front-server/lib/functions/save-token-as-cookie'
import {getApiFetchConfig} from '@tetris/front-server/lib/functions/get-api-fetch-config'
import {pushResponseErrorToState} from '@tetris/front-server/lib/functions/push-response-error-to-state'
import {saveResponseData} from '../functions/save-response-data'

function loadFolderReport (folder, report, config) {
  return GET(`${process.env.ADPEEK_API_URL}/folder/${folder}/report/${report}`, config)
}

export function loadFolderReportAction (tree, company, workspace, folder, report, token = null) {
  return loadFolderReport(folder, report, getApiFetchConfig(tree, token))
    .then(saveResponseTokenAsCookie)
    .then(saveResponseData(tree, [
      'user',
      ['companies', company],
      ['workspaces', workspace],
      ['folders', folder],
      ['reports', report]
    ]))
    .catch(pushResponseErrorToState(tree))
}

export function loadFolderReportActionServerAdaptor ({authToken, params: {company, workspace, folder, report}}, res) {
  return loadFolderReportAction(res.locals.tree, company, workspace, folder, report, authToken)
}

export function loadFolderReportActionRouterAdaptor ({params: {company, workspace, folder, report}}, tree) {
  return loadFolderReportAction(tree, company, workspace, folder, report)
}
