import {GET} from '@tetris/http'
import {saveResponseData} from '../functions/save-response-data'
import {saveResponseTokenAsCookie, getApiFetchConfig, pushResponseErrorToState} from 'tetris-iso/utils'
import find from 'lodash/find'

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

function getCompany (tree, id) {
  return find(tree.get(['user', 'companies']), {id})
}

export function loadCompanyRolesActionServerAdaptor (req, res) {
  const c = getCompany(res.locals.tree, req.params.company)

  return loadCompanyRolesAction(res.locals.tree, c._id, req.authToken)
}

export function loadCompanyRolesActionRouterAdaptor (state, tree) {
  const c = getCompany(tree, state.params.company)

  return loadCompanyRolesAction(tree, c._id)
}
