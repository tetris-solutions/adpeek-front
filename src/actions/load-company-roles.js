import {GET} from '@tetris/http'
import {saveResponseData} from '../functions/save-response-data'
import {saveResponseTokenAsCookie, getApiFetchConfig, pushResponseErrorToState} from 'tetris-iso/utils'

export function loadCompanyRoles (id, config) {
  return GET(`${process.env.USER_API_URL}/company/${id}/roles`, config)
}

export function loadCompanyRolesAction (tree, id, token) {
  return loadCompanyRoles(id, getApiFetchConfig(tree, token))
    .then(saveResponseTokenAsCookie)
    .then(saveResponseData(tree, [
      'user',
      ['companies', id],
      'roles'
    ]))
    .catch(pushResponseErrorToState(tree))
}

export function loadCompanyRolesActionServerAdaptor (req, res) {
  return loadCompanyRolesAction(res.locals.tree, req.params.company, req.authToken)
}

export function loadCompanyRolesActionRouterAdaptor (state, tree) {
  return loadCompanyRolesAction(tree, state.params.company)
}
