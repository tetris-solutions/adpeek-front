import {GET} from '@tetris/http'
import findIndex from 'lodash/findIndex'
import {saveResponseTokenAsCookie} from '@tetris/front-server/lib/functions/save-token-as-cookie'
import {getApiFetchConfig} from '@tetris/front-server/lib/functions/get-api-fetch-config'
import {pushResponseErrorToState} from '@tetris/front-server/lib/functions/push-response-error-to-state'

export function loadCompany (id, config) {
  return GET(`${process.env.USER_API_URL}/company/${id}/roles`, config)
}

export function loadCompanyRolesAction (tree, id, token) {
  return loadCompany(id, getApiFetchConfig(tree, token))
    .then(saveResponseTokenAsCookie)
    .then(response => {
      const companies = tree.get('user', 'companies')
      const index = findIndex(companies, {id})

      tree.set(['user', 'companies', index, 'roles'], response.data)
      tree.commit()

      return response
    })
    .catch(pushResponseErrorToState(tree))
}

export function loadCompanyRolesActionServerAdaptor (req, res) {
  return loadCompanyRolesAction(res.locals.tree, req.params.company, req.authToken)
}

export function loadCompanyRolesActionRouterAdaptor (state, tree) {
  return loadCompanyRolesAction(tree, state.params.company)
}
