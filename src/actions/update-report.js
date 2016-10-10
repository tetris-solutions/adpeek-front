import {PUT} from '@tetris/http'
import assign from 'lodash/assign'
import {saveResponseTokenAsCookie, getApiFetchConfig, pushResponseErrorToState} from 'tetris-iso/utils'
import {getDeepCursor} from '../functions/get-deep-cursor'

function updateReport (folder, report, config) {
  return PUT(`${process.env.ADPEEK_API_URL}/folder/${folder}/report/${report.id}`,
    assign({body: report}, config))
}

export function updateReportAction (tree, {company, workspace, folder}, report) {
  const path = getDeepCursor(tree, [
    'user',
    ['companies', company],
    ['workspaces', workspace],
    ['folders', folder],
    ['reports', report.id]
  ])

  tree.merge(path, report)

  return updateReport(folder, report, getApiFetchConfig(tree))
    .then(saveResponseTokenAsCookie)
    .catch(pushResponseErrorToState(tree))
}

export default updateReportAction
