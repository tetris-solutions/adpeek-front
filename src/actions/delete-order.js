import {DELETE} from '@tetris/http'
import {saveResponseTokenAsCookie, getApiFetchConfig, pushResponseErrorToState} from '@tetris/front-server/utils'
import {getDeepCursor} from '../functions/get-deep-cursor'
import compact from 'lodash/compact'

function deleteOrder (order, config) {
  return DELETE(`${process.env.ADPEEK_API_URL}/order/${order}`, config)
}

export function deleteOrderAction (tree, {company, workspace, folder}, order) {
  return deleteOrder(order, getApiFetchConfig(tree))
    .then(saveResponseTokenAsCookie)
    .then(r => {
      tree.unset(getDeepCursor(tree, compact([
        'user',
        ['companies', company],
        workspace && ['workspaces', workspace],
        folder && ['folders', folder],
        ['orders', order]
      ])))
      tree.commit()
      return r
    })
    .catch(pushResponseErrorToState(tree))
}
