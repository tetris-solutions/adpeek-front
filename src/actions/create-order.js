import {POST} from '@tetris/http'
import assign from 'lodash/assign'
import {saveResponseTokenAsCookie} from '@tetris/front-server/lib/functions/save-token-as-cookie'
import {getApiFetchConfig} from '@tetris/front-server/lib/functions/get-api-fetch-config'
import {pushResponseErrorToState} from '@tetris/front-server/lib/functions/push-response-error-to-state'

export function createOrder (folder, order, config) {
  return POST(`${process.env.ADPEEK_API_URL}/folder/${folder}/order`,
    assign({body: order}, config))
}

export function createOrderAction (tree, folder, order) {
  return createOrder(folder, order, getApiFetchConfig(tree))
    .then(saveResponseTokenAsCookie)
    .catch(pushResponseErrorToState(tree))
}

