import {GET} from '@tetris/http'
import {saveResponseTokenAsCookie} from '@tetris/front-server/lib/functions/save-token-as-cookie'
import {getApiFetchConfig} from '@tetris/front-server/lib/functions/get-api-fetch-config'
import {pushResponseErrorToState} from '@tetris/front-server/lib/functions/push-response-error-to-state'
import {saveResponseData} from '../functions/save-response-data'

export function loadWorkspace (id, config) {
  return GET(`${process.env.ADPEEK_API_URL}/workspace/${id}`, config)
}

export function loadWorkspaceAction (tree, company, workspace, token) {
  return loadWorkspace(workspace, getApiFetchConfig(tree, token))
    .then(saveResponseTokenAsCookie)
    .then(saveResponseData(tree, [
      'user',
      ['companies', company],
      ['workspaces', workspace]
    ]))
    .catch(pushResponseErrorToState(tree))
}

export function loadWorkspaceActionServerAdaptor (req, res) {
  return loadWorkspaceAction(res.locals.tree, req.params.company, req.params.workspace, req.authToken)
}

export function loadWorkspaceActionRouterAdaptor (state, tree) {
  return loadWorkspaceAction(tree, state.params.company, state.params.workspace)
}
