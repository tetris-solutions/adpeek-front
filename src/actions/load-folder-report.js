import keyBy from 'lodash/keyBy'
import {saveResponseTokenAsCookie, getApiFetchConfig, pushResponseErrorToState} from 'tetris-iso/utils'
import {GET} from '@tetris/http'
import assign from 'lodash/assign'
import get from 'lodash/get'
import map from 'lodash/map'

import {saveResponseData} from '../functions/save-response-data'

function loadFolderReport (folder, report, config) {
  return GET(`${process.env.ADPEEK_API_URL}/folder/${folder}/report/${report}`, config)
}

function keepOldReportMetaData (newReport, oldReport) {
  if (oldReport && oldReport.metaData && !newReport.metaData) {
    newReport.metaData = oldReport.metaData
  }

  const mergeOldModule = module => assign({}, get(oldReport, ['modules', module.id]), module)

  newReport.modules = keyBy(map(newReport.modules, mergeOldModule), 'id')

  return newReport
}

export function loadFolderReportAction (tree, company, workspace, folder, report, token = null) {
  return loadFolderReport(folder, report, getApiFetchConfig(tree, token))
    .then(saveResponseTokenAsCookie)
    .then(saveResponseData(tree, [
      'user',
      ['companies', company],
      ['workspaces', workspace],
      ['folders', folder],
      ['reports', report]
    ], keepOldReportMetaData))
    .catch(pushResponseErrorToState(tree))
}

export function loadFolderReportActionServerAdaptor ({authToken, params: {company, workspace, folder, report}}, res) {
  return loadFolderReportAction(res.locals.tree, company, workspace, folder, report, authToken)
}

export function loadFolderReportActionRouterAdaptor ({params: {company, workspace, folder, report}}, tree) {
  return loadFolderReportAction(tree, company, workspace, folder, report)
}
