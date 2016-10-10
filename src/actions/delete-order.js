import {DELETE} from '@tetris/http'
import {saveResponseTokenAsCookie, getApiFetchConfig, pushResponseErrorToState} from 'tetris-iso/utils'

export function deleteOrder (order, config) {
  return DELETE(`${process.env.ADPEEK_API_URL}/order/${order}`, config)
}

export function deleteOrderAction (tree, order) {
  return deleteOrder(order, getApiFetchConfig(tree))
    .then(saveResponseTokenAsCookie)
    .catch(pushResponseErrorToState(tree))
}

export default deleteOrderAction
