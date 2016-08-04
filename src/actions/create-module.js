import {POST} from '@tetris/http'
import assign from 'lodash/assign'
import {saveResponseTokenAsCookie} from '@tetris/front-server/lib/functions/save-token-as-cookie'
import {getApiFetchConfig} from '@tetris/front-server/lib/functions/get-api-fetch-config'
import {pushResponseErrorToState} from '@tetris/front-server/lib/functions/push-response-error-to-state'
import {saveResponseData} from '../functions/save-response-data'

function createModule (report, module, config) {
  return POST(`${process.env.ADPEEK_API_URL}/report/${report}/module`,
    assign({body: module}, config))
}

export function createModuleReportAction (tree, {company, workspace, folder, report}, module) {
  const path = ['user', ['companies', company]]

  if (workspace) path.push(['workspaces', workspace])
  if (folder) path.push(['folders', folder])

  path.push(['reports', report])
  path.push('modules')

  const push = (newModule, ls) => ls.concat([newModule])

  return createModule(report, module, getApiFetchConfig(tree))
    .then(saveResponseTokenAsCookie)
    .then(saveResponseData(tree, path, push))
    .catch(pushResponseErrorToState(tree))
}

export default createModuleReportAction
