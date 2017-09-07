import {GET} from '@tetris/http'
import {saveResponseTokenAsCookie, getApiFetchConfig, pushResponseErrorToState} from '@tetris/front-server/utils'
import {mergeList} from '../functions/save-response-data'

function loadCompanyWorkspaces (id, includeHidden, config) {
  return GET(`${process.env.ADPEEK_API_URL}/company/${id}/workspaces${includeHidden ? '?includeHidden=true' : ''}`, config)
}

export function loadCompanyWorkspacesAction (tree, {company}, includeHidden = false, token) {
  return loadCompanyWorkspaces(company, includeHidden, getApiFetchConfig(tree, token))
    .then(saveResponseTokenAsCookie)
    .then(mergeList(tree, [
      'user',
      ['companies', company],
      'workspaces'
    ]))
    .catch(pushResponseErrorToState(tree))
}

export function loadCompanyWorkspacesActionServerAdaptor (req, res) {
  return loadCompanyWorkspacesAction(res.locals.tree, req.params, false, req.authToken)
}

export function loadCompanyWorkspacesActionRouterAdaptor (state, tree) {
  return loadCompanyWorkspacesAction(tree, state.params)
}
