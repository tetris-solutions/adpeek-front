import {GET} from '@tetris/http'
import {saveResponseTokenAsCookie, getApiFetchConfig, pushResponseErrorToState} from 'tetris-iso/utils'
import {saveResponseData} from '../functions/save-response-data'

export function loadWorkspaceAccounts (workspace, config) {
  return GET(`${process.env.ADPEEK_API_URL}/workspace/${workspace}/accounts`, config)
}

export function loadWorkspaceAccountsAction (tree, company, workspace, token) {
  return loadWorkspaceAccounts(workspace, getApiFetchConfig(tree, token))
    .then(saveResponseTokenAsCookie)
    .then(saveResponseData(tree, [
      'user',
      ['companies', company],
      ['workspaces', workspace],
      'accounts'
    ]))
    .catch(pushResponseErrorToState(tree))
}

export function loadWorkspaceAccountsActionServerAdaptor (req, res) {
  return loadWorkspaceAccountsAction(res.locals.tree, req.params.company, req.params.workspace, req.authToken)
}

export function loadWorkspaceAccountsActionRouterAdaptor (state, tree) {
  return loadWorkspaceAccountsAction(tree, state.params.company, state.params.workspace)
}
