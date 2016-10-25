import {GET} from '@tetris/http'
import {saveResponseTokenAsCookie, getApiFetchConfig, pushResponseErrorToState} from 'tetris-iso/utils'
import {saveResponseData} from '../functions/save-response-data'
import assign from 'lodash/assign'

export function loadWorkspace (id, config) {
  return GET(`${process.env.ADPEEK_API_URL}/workspace/${id}`, config)
}

const merge = (newStuff, oldStuff) => assign({}, oldStuff, newStuff)

export function loadWorkspaceAction (tree, company, workspace, token) {
  return loadWorkspace(workspace, getApiFetchConfig(tree, token))
    .then(saveResponseTokenAsCookie)
    .then(saveResponseData(tree, [
      'user',
      ['companies', company],
      ['workspaces', workspace]
    ], merge))
    .catch(pushResponseErrorToState(tree))
}

export function loadWorkspaceActionServerAdaptor (req, res) {
  return loadWorkspaceAction(res.locals.tree, req.params.company, req.params.workspace, req.authToken)
}

export function loadWorkspaceActionRouterAdaptor (state, tree) {
  return loadWorkspaceAction(tree, state.params.company, state.params.workspace)
}
