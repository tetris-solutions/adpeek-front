import {PUT} from '@tetris/http'
import {saveResponseTokenAsCookie} from '@tetris/front-server/lib/functions/save-token-as-cookie'
import {getApiFetchConfig} from '@tetris/front-server/lib/functions/get-api-fetch-config'
import {pushResponseErrorToState} from '@tetris/front-server/lib/functions/push-response-error-to-state'
import {saveResponseData} from '../functions/save-response-data'
import assign from 'lodash/assign'

export function updateBudget (budget, config) {
  return PUT(`${process.env.ADPEEK_API_URL}/budget/${budget.id}`,
    assign({body: budget}, config))
}

export function updateBudgetAction (tree, company, workspace, folder, order, budget) {
  const update = (newBudget, oldBudget) => assign({}, oldBudget, newBudget)

  return updateBudget(budget, getApiFetchConfig(tree))
    .then(saveResponseTokenAsCookie)
    .then(saveResponseData(tree, [
      'user',
      ['companies', company],
      ['workspaces', workspace],
      ['folders', folder],
      ['orders', order],
      ['budgets', budget.id]
    ]), update)
    .catch(pushResponseErrorToState(tree))
}
