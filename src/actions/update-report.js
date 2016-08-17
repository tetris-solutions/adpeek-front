import {PUT} from '@tetris/http'
import assign from 'lodash/assign'
import {saveResponseTokenAsCookie} from '@tetris/front-server/lib/functions/save-token-as-cookie'
import {getApiFetchConfig} from '@tetris/front-server/lib/functions/get-api-fetch-config'
import {pushResponseErrorToState} from '@tetris/front-server/lib/functions/push-response-error-to-state'
import {getDeepCursor} from '../functions/get-deep-cursor'

function updateReport (report, config) {
  return PUT(`${process.env.ADPEEK_API_URL}/report/${report.id}`,
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

  return updateReport(report, getApiFetchConfig(tree))
    .then(saveResponseTokenAsCookie)
    .catch(pushResponseErrorToState(tree))
}

export default updateReportAction