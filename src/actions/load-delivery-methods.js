import {GET} from '@tetris/http'
import {saveResponseTokenAsCookie} from '@tetris/front-server/lib/functions/save-token-as-cookie'
import {getApiFetchConfig} from '@tetris/front-server/lib/functions/get-api-fetch-config'
import {pushResponseErrorToState} from '@tetris/front-server/lib/functions/push-response-error-to-state'

export function loadDeliveryMethods (config) {
  return GET(`${process.env.ADPEEK_API_URL}/delivery_methods`, config)
}

export function loadDeliveryMethodsAction (tree, token) {
  return loadDeliveryMethods(getApiFetchConfig(tree, token))
    .then(saveResponseTokenAsCookie)
    .then(response => {
      tree.set(['deliveryMethods'], response.data)
      tree.commit()

      return response
    })
    .catch(pushResponseErrorToState(tree))
}

export function loadDeliveryMethodsActionServerAdaptor (req, res) {
  return loadDeliveryMethodsAction(res.locals.tree, req.authToken)
}

export function loadDeliveryMethodsActionRouterAdaptor (state, tree) {
  return loadDeliveryMethodsAction(tree)
}
