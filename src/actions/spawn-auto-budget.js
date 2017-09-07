import {PUT} from '@tetris/http'
import {saveResponseTokenAsCookie, getApiFetchConfig, pushResponseErrorToState} from '@tetris/front-server/utils'

function spawnAutoBudget (order, config) {
  return PUT(`${process.env.ADPEEK_API_URL}/order/${order}/autobudget/spawn`, config)
}

export function spawnAutoBudgetAction (tree, order) {
  return spawnAutoBudget(order, getApiFetchConfig(tree))
    .then(saveResponseTokenAsCookie)
    .catch(pushResponseErrorToState(tree))
}
