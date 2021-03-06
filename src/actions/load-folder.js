import {GET} from '@tetris/http'
import {saveResponseTokenAsCookie, getApiFetchConfig, pushResponseErrorToState} from '@tetris/front-server/utils'
import {mergeResponseData} from '../functions/save-response-data'

export function loadFolder (id, config) {
  return GET(`${process.env.ADPEEK_API_URL}/folder/${id}`, config)
}

export function loadFolderAction (tree, company, workspace, folder, token) {
  return loadFolder(folder, getApiFetchConfig(tree, token))
    .then(saveResponseTokenAsCookie)
    .then(mergeResponseData(tree, [
      'user',
      ['companies', company],
      ['workspaces', workspace],
      ['folders', folder]
    ]))
    .catch(pushResponseErrorToState(tree))
}

export function loadFolderActionServerAdaptor ({authToken, params: {company, workspace, folder}}, res) {
  return loadFolderAction(res.locals.tree, company, workspace, folder, authToken)
}

export function loadFolderActionRouterAdaptor ({params: {company, workspace, folder}}, tree) {
  return loadFolderAction(tree, company, workspace, folder)
}
