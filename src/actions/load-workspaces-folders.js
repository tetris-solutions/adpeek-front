import {GET} from '@tetris/http'
import {saveResponseTokenAsCookie} from '@tetris/front-server/lib/functions/save-token-as-cookie'
import {getApiFetchConfig} from '@tetris/front-server/lib/functions/get-api-fetch-config'
import {pushResponseErrorToState} from '@tetris/front-server/lib/functions/push-response-error-to-state'
import {saveResponseData} from '../functions/save-response-data'

export function loadWorkspaceFolders (workspace, config) {
  return GET(`${process.env.ADPEEK_API_URL}/workspace/${workspace}/folders`, config)
}

export function loadWorkspaceFoldersAction (tree, company, workspace, token) {
  return loadWorkspaceFolders(workspace, getApiFetchConfig(tree, token))
    .then(saveResponseTokenAsCookie)
    .then(saveResponseData(tree, [
      'user',
      ['companies', company],
      ['workspaces', workspace],
      'folders'
    ]))
    .catch(pushResponseErrorToState(tree))
}

export function loadWorkspaceFoldersActionServerAdaptor (req, res) {
  return loadWorkspaceFoldersAction(res.locals.tree, req.params.company, req.params.workspace, req.authToken)
}

export function loadWorkspaceFoldersActionRouterAdaptor (state, tree) {
  return loadWorkspaceFoldersAction(tree, state.params.company, state.params.workspace)
}
