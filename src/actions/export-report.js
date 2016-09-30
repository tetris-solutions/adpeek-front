import {POST} from '@tetris/http'
import assign from 'lodash/assign'
import {getApiFetchConfig} from '@tetris/front-server/lib/functions/get-api-fetch-config'
import {saveResponseTokenAsCookie} from '@tetris/front-server/lib/functions/save-token-as-cookie'
import {pushResponseErrorToState} from '@tetris/front-server/lib/functions/push-response-error-to-state'

function exportReport (workspace, type, report, config) {
  return POST(`${process.env.ADPEEK_API_URL}/workspace/${workspace}/report/${report.id}/export?type=${type}`,
    assign({body: report}, config))
}

export function exportReportAction (tree, {workspace}, type, report) {
  return exportReport(workspace, type, report, getApiFetchConfig(tree))
    .then(saveResponseTokenAsCookie)
    .catch(pushResponseErrorToState(tree))
}
