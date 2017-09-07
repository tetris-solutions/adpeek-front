import {GET} from '@tetris/http'
import {saveResponseTokenAsCookie, getApiFetchConfig, pushResponseErrorToState} from '@tetris/front-server/utils'

export function loadDeliveryMethods (config) {
  return GET(`${process.env.ADPEEK_API_URL}/delivery_methods`, config)
}

export function loadDeliveryMethodsAction (tree, token) {
  return loadDeliveryMethods(getApiFetchConfig(tree, token))
    .then(saveResponseTokenAsCookie)
    .then(function onSuccess (response) {
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
