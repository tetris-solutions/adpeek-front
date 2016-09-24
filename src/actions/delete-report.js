import {DELETE} from '@tetris/http'
import {saveResponseTokenAsCookie} from '@tetris/front-server/lib/functions/save-token-as-cookie'
import {getApiFetchConfig} from '@tetris/front-server/lib/functions/get-api-fetch-config'
import {pushResponseErrorToState} from '@tetris/front-server/lib/functions/push-response-error-to-state'

function deleteReport (company, report, config) {
  return DELETE(`${process.env.ADPEEK_API_URL}/company/${company}/report/${report}`, (config))
}

export function deleteReportAction (tree, {company}, report) {
  return deleteReport(company, report, getApiFetchConfig(tree))
    .then(saveResponseTokenAsCookie)
    .catch(pushResponseErrorToState(tree))
}

export default deleteReportAction
