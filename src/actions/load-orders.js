import {GET} from '@tetris/http'
import {saveResponseTokenAsCookie} from '@tetris/front-server/lib/functions/save-token-as-cookie'
import {getApiFetchConfig} from '@tetris/front-server/lib/functions/get-api-fetch-config'
import {pushResponseErrorToState} from '@tetris/front-server/lib/functions/push-response-error-to-state'
import {saveResponseData} from '../functions/save-response-data'

export function loadOrders (folder, config) {
  return GET(`${process.env.ADPEEK_API_URL}/folder/${folder}/orders`, config)
}

export function loadOrdersAction (tree, company, workspace, folder, token) {
  return loadOrders(folder, getApiFetchConfig(tree, token))
    .then(saveResponseTokenAsCookie)
    .then(saveResponseData(tree, [
      'user',
      ['companies', company],
      ['workspaces', workspace],
      ['folders', folder],
      'orders'
    ]))
    .catch(pushResponseErrorToState(tree))
}

export function loadOrdersActionServerAdaptor (req, res) {
  return loadOrdersAction(
    res.locals.tree,
    req.params.company,
    req.params.workspace,
    req.params.folder,
    req.authToken)
}

export function loadOrdersActionRouterAdaptor (state, tree) {
  return loadOrdersAction(
    tree,
    state.params.company,
    state.params.workspace,
    state.params.folder)
}
