import {GET} from '@tetris/http'
import {saveResponseTokenAsCookie} from '@tetris/front-server/lib/functions/save-token-as-cookie'
import {getApiFetchConfig} from '@tetris/front-server/lib/functions/get-api-fetch-config'
import {pushResponseErrorToState} from '@tetris/front-server/lib/functions/push-response-error-to-state'
import {saveResponseData} from '../functions/save-response-data'
import compact from 'lodash/compact'
import forEach from 'lodash/forEach'
import moment from 'moment'
import pick from 'lodash/pick'

const yesterday = () => moment().subtract(1, 'day').format('YYYY-MM-DD')

export function loadAutoBudgetLogs (day, query, config) {
  const qs = []

  forEach(query, (val, name) =>
    qs.push(`${name}=${val}`))

  return GET(`${process.env.ADPEEK_API_URL}/autobudget/logs/${day}?${qs.join('&')}`, config)
}

export function loadAutoBudgetLogsAction (tree, day, params, token) {
  const query = pick(params, 'company', 'workspace', 'folder', 'order')
  const sQuery = {}

  if (query.order) {
    sQuery.order = query.order
  } else if (query.folder) {
    sQuery.order = query.folder
  } else if (query.workspace) {
    sQuery.order = query.workspace
  } else if (query.company) {
    sQuery.order = query.company
  }

  return loadAutoBudgetLogs(day, sQuery, getApiFetchConfig(tree, token))
    .then(saveResponseTokenAsCookie)
    .then(saveResponseData(tree, compact([
      'user',
      ['companies', query.company],
      query.workspace && ['workspaces', query.workspace],
      query.folder && ['folders', query.folder],
      query.order && ['orders', query.order],
      'autoBudgetLogs'
    ])))
    .catch(pushResponseErrorToState(tree))
}

export function loadAutoBudgetLogsActionServerAdaptor (req, res) {
  return loadAutoBudgetLogsAction(
    res.locals.tree,
    req.query.day || yesterday(),
    req.params,
    req.authToken)
}

export function loadAutoBudgetLogsActionRouterAdaptor (state, tree) {
  return loadAutoBudgetLogsAction(
    tree,
    state.location.query.day || yesterday(),
    state.params)
}
