import {GET} from '@tetris/http'
import {saveResponseTokenAsCookie, getApiFetchConfig, pushResponseErrorToState} from 'tetris-iso/utils'
import {mergeList} from '../functions/save-response-data'

export function loadWorkspaceFolders (workspace, config) {
  return GET(`${process.env.ADPEEK_API_URL}/workspace/${workspace}/folders`, config)
}

export function loadWorkspaceFoldersAction (tree, company, workspace, token) {
  return loadWorkspaceFolders(workspace, getApiFetchConfig(tree, token))
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
  return loadWorkspaceFoldersAction(res.locals.tree, req.params.company, req.params.workspace, req.authToken)
}

export function loadWorkspaceFoldersActionRouterAdaptor (state, tree) {
  return loadWorkspaceFoldersAction(tree, state.params.company, state.params.workspace)
}
