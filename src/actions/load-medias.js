import {GET} from '@tetris/http'
import {saveResponseTokenAsCookie, getApiFetchConfig, pushResponseErrorToState} from '@tetris/front-server/utils'

export function loadMedias (config) {
  return GET(`${process.env.ADPEEK_API_URL}/medias`, config)
}

export function loadMediasAction (tree, token) {
  return loadMedias(getApiFetchConfig(tree, token))
    .then(saveResponseTokenAsCookie)
    .then(function onSuccess (response) {
      tree.set(['medias'], response.data)
      tree.commit()

      return response
    })
    .catch(pushResponseErrorToState(tree))
}

export function loadMediasActionServerAdaptor (req, res) {
  return loadMediasAction(res.locals.tree, req.authToken)
}

export function loadMediasActionRouterAdaptor (state, tree) {
  return loadMediasAction(tree)
}
