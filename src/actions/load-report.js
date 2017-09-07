import {GET} from '@tetris/http'
import {saveResponseTokenAsCookie, getApiFetchConfig, pushResponseErrorToState} from '@tetris/front-server/utils'
import findIndex from 'lodash/findIndex'
import assign from 'lodash/assign'
import map from 'lodash/map'
import {saveResponseData} from '../functions/save-response-data'
import compact from 'lodash/compact'
import {inferLevelFromParams} from '../functions/infer-level-from-params'

function loadReport (level, id, report, guest, config) {
  return GET(`${process.env.ADPEEK_API_URL}/${level}/${id}/report/${report}${guest ? '?guest=true' : ''}`, config)
}

function keepOldReportMetaData (newReport, oldReport) {
  if (!oldReport) return newReport

  newReport.metaData = newReport.metaData || oldReport.metaData

  const mergeOldModule = module => assign({},
    findIndex(oldReport.modules, {id: module.id}),
    module)

  newReport.modules = map(newReport.modules, mergeOldModule)

  return newReport
}

export function loadReportAction (tree, params, report, token = null) {
  const path = compact([
    'user',
    ['companies', params.company],
    params.workspace && ['workspaces', params.workspace],
    params.folder && ['folders', params.folder],
    ['reports', report]
  ])

  const level = inferLevelFromParams(params)

  return loadReport(level, params[level], report, Boolean(params.reportShare), getApiFetchConfig(tree, token))
    .then(saveResponseTokenAsCookie)
    .then(saveResponseData(tree, path, keepOldReportMetaData))
    .catch(pushResponseErrorToState(tree))
}

export function loadReportActionServerAdaptor ({authToken, params}, res) {
  return loadReportAction(res.locals.tree, params, params.report, authToken)
}

export function loadReportActionRouterAdaptor ({params}, tree) {
  return loadReportAction(tree, params, params.report)
}

export function loadReportShareActionServerAdaptor ({authToken}, res) {
  const {tree} = res.locals
  const {params} = tree.get('reportShare')

  return loadReportAction(tree, params, params.report, authToken)
}
