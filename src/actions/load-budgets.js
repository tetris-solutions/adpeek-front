import {GET} from '@tetris/http'
import {saveResponseTokenAsCookie} from '@tetris/front-server/lib/functions/save-token-as-cookie'
import {getApiFetchConfig} from '@tetris/front-server/lib/functions/get-api-fetch-config'
import {pushResponseErrorToState} from '@tetris/front-server/lib/functions/push-response-error-to-state'
import {saveResponseData} from '../functions/save-response-data'

export function loadBudgets (order, config) {
  return GET(`${process.env.ADPEEK_API_URL}/order/${order}/budgets`, config)
}

export function loadBudgetsAction (tree, company, workspace, folder, order, token) {
  return loadBudgets(order, getApiFetchConfig(tree, token))
    .then(saveResponseTokenAsCookie)
    .then(saveResponseData(tree, [
      'user',
      ['companies', company],
      ['workspaces', workspace],
      ['folders', folder],
      ['orders', order],
      'budgets'
    ]))
    .catch(pushResponseErrorToState(tree))
}

export function loadBudgetsActionServerAdaptor (req, res) {
  return loadBudgetsAction(
    res.locals.tree,
    req.params.company,
    req.params.workspace,
    req.params.folder,
    req.params.order,
    req.authToken)
}

export function loadBudgetsActionRouterAdaptor (state, tree) {
  return loadBudgetsAction(
    tree,
    state.params.company,
    state.params.workspace,
    state.params.folder,
    state.params.order)
}
