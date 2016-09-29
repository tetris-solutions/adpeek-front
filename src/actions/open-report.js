import {PUT} from '@tetris/http'
import assign from 'lodash/assign'
import {saveResponseTokenAsCookie} from '@tetris/front-server/lib/functions/save-token-as-cookie'
import {getApiFetchConfig} from '@tetris/front-server/lib/functions/get-api-fetch-config'
import {pushResponseErrorToState} from '@tetris/front-server/lib/functions/push-response-error-to-state'

function openReport (folder, report, config) {
  return PUT(`${process.env.ADPEEK_API_URL}/folder/${folder}/report/${report}/open`,
    assign({body: {}}, config))
}

export function openReportAction (tree, {folder}, report) {
  return openReport(folder, report, getApiFetchConfig(tree))
    .then(saveResponseTokenAsCookie)
    .catch(pushResponseErrorToState(tree))
}

export default openReportAction
