import {POST, PUT} from '@tetris/http'
import assign from 'lodash/assign'
import {saveResponseTokenAsCookie, getApiFetchConfig, pushResponseErrorToState} from '@tetris/front-server/utils'

function createOrder (order, config) {
  return POST(`${process.env.ADPEEK_API_URL}/folder/${order.folder}/order`, assign({body: order}, config))
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
