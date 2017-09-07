import {GET} from '@tetris/http'
import {saveResponseTokenAsCookie, getApiFetchConfig, pushResponseErrorToState} from '@tetris/front-server/utils'
import {saveResponseData} from '../functions/save-response-data'
import compact from 'lodash/compact'
import forEach from 'lodash/forEach'
import moment from 'moment'
import pick from 'lodash/pick'
import find from 'lodash/find'

const yesterday = () => moment().subtract(1, 'day').format('YYYY-MM-DD')

export function loadAutoBudgetLogs (day, query, config) {
  const qs = []
  const d = moment(day)

  query.from = d.format('X')
  query.to = d.add(1, 'day').subtract(1, 'second').format('X')

  forEach(query, (val, name) =>
    qs.push(`${name}=${val}`))

  return GET(`${process.env.ADPEEK_API_URL}/autobudget/logs?${qs.join('&')}`, config)
}

export function loadAutoBudgetLogsAction (tree, day, params, token) {
  const keys = ['company', 'workspace', 'folder', 'order'].reverse()
  const query = pick(params, ...keys)
  const selectedKey = find(keys, key => Boolean(query[key]))
  const queryParams = {
    [selectedKey]: query[selectedKey]
  }

  return loadAutoBudgetLogs(day, queryParams, getApiFetchConfig(tree, token))
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
    req.params.day || yesterday(),
    req.params,
    req.authToken)
}

export function loadAutoBudgetLogsActionRouterAdaptor (state, tree) {
  return loadAutoBudgetLogsAction(
    tree,
    state.params.day || yesterday(),
    state.params)
}
