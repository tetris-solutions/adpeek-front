import {PUT} from '@tetris/http'
import {saveResponseTokenAsCookie} from '@tetris/front-server/lib/functions/save-token-as-cookie'
import {getApiFetchConfig} from '@tetris/front-server/lib/functions/get-api-fetch-config'
import {pushResponseErrorToState} from '@tetris/front-server/lib/functions/push-response-error-to-state'

function spawnAutoBudget (order, config) {
  return PUT(`${process.env.ADPEEK_API_URL}/order/${order}/autobudget/spawn`, config)
}

export function spawnAutoBudgetAction (tree, order) {
  return spawnAutoBudget(order, getApiFetchConfig(tree))
    .then(saveResponseTokenAsCookie)
    .catch(pushResponseErrorToState(tree))
}
