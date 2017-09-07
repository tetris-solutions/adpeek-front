import {GET} from '@tetris/http'
import {saveResponseTokenAsCookie, getApiFetchConfig, pushResponseErrorToState} from '@tetris/front-server/utils'

export function loadStatuses (config) {
  return GET(`${process.env.ADPEEK_API_URL}/statuses`, config)
}

export function loadStatusesAction (tree, token) {
  return loadStatuses(getApiFetchConfig(tree, token))
    .then(saveResponseTokenAsCookie)
    .then(function onSuccess (response) {
      tree.set(['statuses'], response.data)
      tree.commit()

      return response
    })
    .catch(pushResponseErrorToState(tree))
}

export function loadStatusesActionServerAdaptor (req, res) {
  return loadStatusesAction(res.locals.tree, req.authToken)
}

export function loadStatusesActionRouterAdaptor (state, tree) {
  return loadStatusesAction(tree)
}
