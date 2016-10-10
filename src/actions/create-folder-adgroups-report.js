import {POST} from '@tetris/http'
import {saveResponseTokenAsCookie, getApiFetchConfig, pushResponseErrorToState} from 'tetris-iso/utils'
import {saveResponseData} from '../functions/save-response-data'
import assign from 'lodash/assign'

export function createFolderAdGroupsReport (adGroups, config) {
  return POST(`${process.env.ADPEEK_API_URL}/report/adgroups`, assign(config, {body: adGroups}))
}

export function createFolderAdGroupsReportAction (tree, company, workspace, folder, adGroups, token) {
  return createFolderAdGroupsReport(adGroups, getApiFetchConfig(tree, token))
    .then(saveResponseTokenAsCookie)
    .then(saveResponseData(tree, [
      'user',
      ['companies', company],
      ['workspaces', workspace],
      ['folders', folder],
      'adGroupsReport'
    ]))
    .catch(pushResponseErrorToState(tree))
}
