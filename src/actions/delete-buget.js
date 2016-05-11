import {DELETE} from '@tetris/http'
import {saveResponseTokenAsCookie} from '@tetris/front-server/lib/functions/save-token-as-cookie'
import {getApiFetchConfig} from '@tetris/front-server/lib/functions/get-api-fetch-config'
import {pushResponseErrorToState} from '@tetris/front-server/lib/functions/push-response-error-to-state'

export function deleteBudget (budget, config) {
  return DELETE(`${process.env.ADPEEK_API_URL}/budget/${budget}`, config)
}

export function deleteBudgetAction (tree, budget) {
  return deleteBudget(budget, getApiFetchConfig(tree))
    .then(saveResponseTokenAsCookie)
    .catch(pushResponseErrorToState(tree))
}
