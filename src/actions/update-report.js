import {PUT} from '@tetris/http'
import assign from 'lodash/assign'
import {saveResponseTokenAsCookie} from '@tetris/front-server/lib/functions/save-token-as-cookie'
import {getApiFetchConfig} from '@tetris/front-server/lib/functions/get-api-fetch-config'
import {pushResponseErrorToState} from '@tetris/front-server/lib/functions/push-response-error-to-state'

function updateReport (report, config) {
  return PUT(`${process.env.ADPEEK_API_URL}/report/${report.id}`,
    assign({body: report}, config))
}

export function updateReportAction (tree, report) {
  return updateReport(report, getApiFetchConfig(tree))
    .then(saveResponseTokenAsCookie)
    .catch(pushResponseErrorToState(tree))
}

export default updateReportAction
