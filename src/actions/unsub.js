import {DELETE} from '@tetris/http'
import {saveResponseTokenAsCookie, getApiFetchConfig, pushResponseErrorToState} from '@tetris/front-server/utils'

function unsubscribe (mailing, email, config) {
  return DELETE(`${process.env.ADPEEK_API_URL}/public/mailing/${mailing}/subscriber/${email}`, config)
}

export function unsubscribeAction (tree, mailing, email, token) {
  return unsubscribe(mailing, email, getApiFetchConfig(tree, token))
    .then(saveResponseTokenAsCookie)
    .then(response => {
      tree.set(['unsub'], response.data)
      return response
    })
    .catch(pushResponseErrorToState(tree))
}

export function unsubscribeActionServerAdaptor (req, res) {
  return unsubscribeAction(res.locals.tree, req.params.mailing, req.params.email, req.authToken)
}

export function unsubscribeActionRouterAdaptor (state, tree) {
  return unsubscribeAction(tree, state.params.mailing, state.params.email)
}
