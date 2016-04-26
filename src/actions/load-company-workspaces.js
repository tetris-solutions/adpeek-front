import {GET} from '@tetris/http'
import {saveResponseTokenAsCookie} from '@tetris/front-server/lib/functions/save-token-as-cookie'
import {getApiFetchConfig} from '@tetris/front-server/lib/functions/get-api-fetch-config'
import {pushResponseErrorToState} from '@tetris/front-server/lib/functions/push-response-error-to-state'
import {saveResponseData} from '../functions/save-response-data'

export function loadCompanyWorkspaces (id, config) {
  return GET(`${process.env.ADPEEK_API_URL}/company/${id}/workspaces`, config)
}

export function loadCompanyWorkspacesAction (tree, id, token) {
  return loadCompanyWorkspaces(id, getApiFetchConfig(tree, token))
    .then(saveResponseTokenAsCookie)
    .then(saveResponseData(tree, [
      'user',
      ['companies', id],
      'workspaces'
    ]))
    .catch(pushResponseErrorToState(tree))
}

export function loadCompanyWorkspacesActionServerAdaptor (req, res) {
  return loadCompanyWorkspacesAction(res.locals.tree, req.params.company, req.authToken)
}

export function loadCompanyWorkspacesActionRouterAdaptor (state, tree) {
  return loadCompanyWorkspacesAction(tree, state.params.company)
}
