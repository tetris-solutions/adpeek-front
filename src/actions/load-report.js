import keyBy from 'lodash/keyBy'
import {saveResponseTokenAsCookie, getApiFetchConfig, pushResponseErrorToState} from 'tetris-iso/utils'
import {GET} from '@tetris/http'
import assign from 'lodash/assign'
import get from 'lodash/get'
import map from 'lodash/map'
import {saveResponseData} from '../functions/save-response-data'
import compact from 'lodash/compact'
import {inferLevelFromParams} from '../functions/infer-level-from-params'

function loadReport (level, id, report, config) {
  return GET(`${process.env.ADPEEK_API_URL}/${level}/${id}/report/${report}`, config)
}

function keepOldReportMetaData (newReport, oldReport) {
  if (oldReport && oldReport.metaData && !newReport.metaData) {
    newReport.metaData = oldReport.metaData
  }

  const mergeOldModule = module => assign({}, get(oldReport, ['modules', module.id]), module)

  newReport.modules = keyBy(map(newReport.modules, mergeOldModule), 'id')

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

  return loadReport(level, params[level], report, getApiFetchConfig(tree, token))
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