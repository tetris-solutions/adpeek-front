import {POST} from '@tetris/http'
import assign from 'lodash/assign'
import {saveResponseTokenAsCookie, getApiFetchConfig, pushResponseErrorToState} from 'tetris-iso/utils'

export function cloneOrder (originalOrderId, newOrder, config) {
  return POST(`${process.env.ADPEEK_API_URL}/order/${originalOrderId}/clone`, assign({body: newOrder}, config))
}

export function cloneOrderAction (tree, originalOrderId, newOrder) {
  return cloneOrder(originalOrderId, newOrder, getApiFetchConfig(tree))
    .then(saveResponseTokenAsCookie)
    .catch(pushResponseErrorToState(tree))
}
