import {GET} from '@tetris/http'
import {saveResponseTokenAsCookie, getApiFetchConfig, pushResponseErrorToState} from 'tetris-iso/utils'
import {saveResponseData} from '../functions/save-response-data'
import compact from 'lodash/compact'

function loadReports (level, id, limitToFirst = false, config) {
  let url = `${process.env.ADPEEK_API_URL}/${level}/${id}/reports`

  if (limitToFirst) {
    url += '?limit=1'
  }

  return GET(url, config)
}

export function loadReportsAction (tree, params, limitToFirst = false, token = null) {
  let level = 'company'

  if (params.folder) {
    level = 'folder'
  } else if (params.folder) {
    level = 'workspace'
  }

  const path = compact([
    'user',
    ['companies', params.company],
    params.workspace && ['workspaces', params.workspace],
    params.folder && ['folders', params.folder],
    'reports'
  ])

  return loadReports(level, params[level], limitToFirst, getApiFetchConfig(tree, token))
    .then(saveResponseTokenAsCookie)
    .then(saveResponseData(tree, path))
    .catch(pushResponseErrorToState(tree))
}

export function loadReportsActionServerAdaptor ({authToken, params}, res, limitToFirst = false) {
  return loadReportsAction(res.locals.tree, params, limitToFirst, authToken)
}

export function loadReportsActionRouterAdaptor ({params}, tree, limitToFirst = false) {
  return loadReportsAction(tree, params, limitToFirst)
}
