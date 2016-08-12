import {POST} from '@tetris/http'
import assign from 'lodash/assign'
import {getApiFetchConfig} from '@tetris/front-server/lib/functions/get-api-fetch-config'
import {saveResponseTokenAsCookie} from '@tetris/front-server/lib/functions/save-token-as-cookie'
import {pushResponseErrorToState} from '@tetris/front-server/lib/functions/push-response-error-to-state'

function createReportPdf (report, config) {
  return POST(`${process.env.ADPEEK_API_URL}/create-report-pdf`,
    assign({body: report}, config))
}

export function createReportPdfAction (tree, report) {
  return createReportPdf(report, getApiFetchConfig(tree))
    .then(saveResponseTokenAsCookie)
    .catch(pushResponseErrorToState(tree))
}
