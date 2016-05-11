import {PUT} from '@tetris/http'
import {saveResponseTokenAsCookie} from '@tetris/front-server/lib/functions/save-token-as-cookie'
import {getApiFetchConfig} from '@tetris/front-server/lib/functions/get-api-fetch-config'
import {pushResponseErrorToState} from '@tetris/front-server/lib/functions/push-response-error-to-state'
import {saveResponseData} from '../functions/save-response-data'
import assign from 'lodash/assign'

export function updateOrder (order, config) {
  return PUT(`${process.env.ADPEEK_API_URL}/order/${order.id}`,
    assign({body: order}, config))
}

export function updateOrderAction (tree, company, workspace, folder, order) {
  const update = (newOrder, oldOrder) => assign({}, oldOrder, newOrder)

  return updateOrder(order, getApiFetchConfig(tree))
    .then(saveResponseTokenAsCookie)
    .then(saveResponseData(tree, [
      'user',
      ['companies', company],
      ['workspaces', workspace],
      ['folders', folder],
      ['orders', order.id]
    ]), update)
    .catch(pushResponseErrorToState(tree))
}
