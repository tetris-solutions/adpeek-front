import {GET} from '@tetris/http'
import {saveResponseTokenAsCookie, getApiFetchConfig, pushResponseErrorToState} from '@tetris/front-server/utils'
import {mergeList} from '../functions/save-response-data'

function loadUserCompanies (config) {
  return GET(`${process.env.ADPEEK_API_URL}/user/companies`, config)
}

export function loadUserCompaniesAction (tree, token) {
  return loadUserCompanies(getApiFetchConfig(tree, token))
    .then(saveResponseTokenAsCookie)
    .then(mergeList(tree, [
      'user',
      'companies'
    ]))
    .catch(pushResponseErrorToState(tree))
}

export function loadUserCompaniesActionServerAdaptor (req, res) {
  return loadUserCompaniesAction(res.locals.tree, req.authToken)
}

export function loadUserCompaniesActionRouterAdaptor (state, tree) {
  return loadUserCompaniesAction(tree)
}
