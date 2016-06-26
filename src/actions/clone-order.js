import {POST} from '@tetris/http'
import assign from 'lodash/assign'
import {saveResponseTokenAsCookie} from '@tetris/front-server/lib/functions/save-token-as-cookie'
import {getApiFetchConfig} from '@tetris/front-server/lib/functions/get-api-fetch-config'
import {pushResponseErrorToState} from '@tetris/front-server/lib/functions/push-response-error-to-state'

export function cloneOrder (originalOrderId, newOrder, config) {
  return POST(`${process.env.ADPEEK_API_URL}/order/${originalOrderId}/clone`, assign({body: newOrder}, config))
}

export function cloneOrderAction (tree, originalOrderId, newOrder) {
  return cloneOrder(originalOrderId, newOrder, getApiFetchConfig(tree))
    .then(saveResponseTokenAsCookie)
    .catch(pushResponseErrorToState(tree))
}
