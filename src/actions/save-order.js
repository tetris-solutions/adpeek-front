import {POST, PUT} from '@tetris/http'
import assign from 'lodash/assign'
import {saveResponseTokenAsCookie} from '@tetris/front-server/lib/functions/save-token-as-cookie'
import {getApiFetchConfig} from '@tetris/front-server/lib/functions/get-api-fetch-config'
import {pushResponseErrorToState} from '@tetris/front-server/lib/functions/push-response-error-to-state'

function createOrder (order, config) {
  return POST(`${process.env.ADPEEK_API_URL}/order`, assign({body: order}, config))
}

function updateOrder (order, config) {
  return PUT(`${process.env.ADPEEK_API_URL}/order/${order.id}`, assign({body: order}, config))
}

export function saveOrderAction (tree, order) {
  const save = order.id ? updateOrder : createOrder
  return save(order, getApiFetchConfig(tree))
    .then(saveResponseTokenAsCookie)
    .catch(pushResponseErrorToState(tree))
}
