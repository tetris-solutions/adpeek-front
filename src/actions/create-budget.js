import {POST} from '@tetris/http'
import assign from 'lodash/assign'
import {saveResponseTokenAsCookie} from '@tetris/front-server/lib/functions/save-token-as-cookie'
import {getApiFetchConfig} from '@tetris/front-server/lib/functions/get-api-fetch-config'
import {pushResponseErrorToState} from '@tetris/front-server/lib/functions/push-response-error-to-state'

export function createBudget (order, budget, config) {
  return POST(`${process.env.ADPEEK_API_URL}/order/${order}/budget`,
    assign({body: budget}, config))
}

export function createBudgetAction (tree, order, budget) {
  return createBudget(order, budget, getApiFetchConfig(tree))
    .then(saveResponseTokenAsCookie)
    .catch(pushResponseErrorToState(tree))
}
