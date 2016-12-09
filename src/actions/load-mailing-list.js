import {GET} from '@tetris/http'
import {saveResponseTokenAsCookie, getApiFetchConfig, pushResponseErrorToState} from 'tetris-iso/utils'
import {saveResponseData} from '../functions/save-response-data'
import compact from 'lodash/compact'
import qs from 'query-string'
import pick from 'lodash/pick'

function loadMailingList (params, config) {
  const search = qs.stringify(pick(params, 'workspace', 'folder', 'report'))

  return GET(`${process.env.ADPEEK_API_URL}/company/${params.company}/mailing?${search}`, config)
}

export function loadMailingListAction (tree, params, token) {
  return loadMailingList(params, getApiFetchConfig(tree, token))
    .then(saveResponseTokenAsCookie)
    .then(saveResponseData(tree, compact([
      'user',
      ['companies', params.company],
      params.workspace && ['workspaces', params.workspace],
      params.folder && ['folders', params.folder],
      params.report && ['reports', params.report],
      'mailings'
    ])))
    .catch(pushResponseErrorToState(tree))
}

export function loadMailingListActionServerAdaptor (req, res) {
  return loadMailingListAction(res.locals.tree, req.params, req.authToken)
}

export function loadMailingListActionRouterAdaptor (state, tree) {
  return loadMailingListAction(tree, state.params)
}
