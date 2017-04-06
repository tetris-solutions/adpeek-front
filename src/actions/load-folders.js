import {GET} from '@tetris/http'
import {saveResponseTokenAsCookie, getApiFetchConfig, pushResponseErrorToState} from 'tetris-iso/utils'
import {mergeList} from '../functions/save-response-data'

function loadWorkspaceFolders (workspace, includeHidden, config) {
  return GET(`${process.env.ADPEEK_API_URL}/workspace/${workspace}/folders${includeHidden ? '?includeHidden=true' : ''}`, config)
}

export function loadWorkspaceFoldersAction (tree, {company, workspace}, includeHidden = false, token) {
  return loadWorkspaceFolders(workspace, includeHidden, getApiFetchConfig(tree, token))
    .then(saveResponseTokenAsCookie)
    .then(mergeList(tree, [
      'user',
      ['companies', company],
      ['workspaces', workspace],
      'folders'
    ]))
    .catch(pushResponseErrorToState(tree))
}

export function loadWorkspaceFoldersActionServerAdaptor (req, res) {
  return loadWorkspaceFoldersAction(res.locals.tree, req.params, false, req.authToken)
}

export function loadWorkspaceFoldersActionRouterAdaptor (state, tree) {
  return loadWorkspaceFoldersAction(tree, state.params)
}
