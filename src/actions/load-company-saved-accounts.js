import {GET} from '@tetris/http'
import {saveResponseTokenAsCookie, getApiFetchConfig, pushResponseErrorToState} from 'tetris-iso/utils'
import {saveResponseData} from '../functions/save-response-data'

function loadCompanySavedAccounts (id, config) {
  return GET(`${process.env.ADPEEK_API_URL}/company/${id}/accounts/saved`, config)
}

export function loadCompanySavedAccountsAction (tree, id, token) {
  return loadCompanySavedAccounts(id, getApiFetchConfig(tree, token))
    .then(saveResponseTokenAsCookie)
    .then(saveResponseData(tree, [
      'user',
      ['companies', id],
      'savedAccounts'
    ]))
    .catch(pushResponseErrorToState(tree))
}

export function loadCompanySavedAccountsActionServerAdaptor (req, res) {
  return loadCompanySavedAccountsAction(res.locals.tree, req.params.company, req.authToken)
}

export function loadCompanySavedAccountsActionRouterAdaptor (state, tree) {
  return loadCompanySavedAccountsAction(tree, state.params.company)
}
