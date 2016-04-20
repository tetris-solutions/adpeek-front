import {GET} from '@tetris/http'
import findIndex from 'lodash/findIndex'
import {saveResponseTokenAsCookie} from '@tetris/front-server/lib/functions/save-token-as-cookie'
import {getApiFetchConfig} from '@tetris/front-server/lib/functions/get-api-fetch-config'
import {pushResponseErrorToState} from '@tetris/front-server/lib/functions/push-response-error-to-state'

export function loadWorkspaceFolders (company, workspace, config) {
  return GET(`${process.env.ADPEEK_API_URL}/company/${company}/workspace/${workspace}/folders`, config)
}

export function loadWorkspaceFoldersAction (tree, company, workspace, token) {
  return loadWorkspaceFolders(company, workspace, getApiFetchConfig(tree, token))
    .then(saveResponseTokenAsCookie)
    .then(response => {
      const companies = tree.get('user', 'companies')
      const companyIndex = findIndex(companies, {id: company})
      const workspaceIndex = findIndex(companies[companyIndex].workspaces, {id: workspace})

      tree.set(['user', 'companies', companyIndex, 'workspaces', workspaceIndex, 'folders'], response.data)
      tree.commit()

      return response
    })
    .catch(pushResponseErrorToState(tree))
}

export function loadWorkspaceFoldersActionServerAdaptor (req, res) {
  return loadWorkspaceFoldersAction(res.locals.tree, req.params.company, req.params.workspace, req.authToken)
}

export function loadWorkspaceFoldersActionRouterAdaptor (state, tree) {
  return loadWorkspaceFoldersAction(tree, state.params.company, state.params.workspace)
}
