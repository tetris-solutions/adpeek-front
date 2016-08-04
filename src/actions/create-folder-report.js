import {POST} from '@tetris/http'
import assign from 'lodash/assign'
import {saveResponseTokenAsCookie} from '@tetris/front-server/lib/functions/save-token-as-cookie'
import {getApiFetchConfig} from '@tetris/front-server/lib/functions/get-api-fetch-config'
import {pushResponseErrorToState} from '@tetris/front-server/lib/functions/push-response-error-to-state'

function createFolderReport (company, workspace, folder, report, config) {
  return POST(`${process.env.ADPEEK_API_URL}/company/${company}/report`,
    assign({body: report}, config))
}

export function createFolderReportAction (tree, company, workspace, folder, report) {
  return createFolderReport(company, workspace, folder, report, getApiFetchConfig(tree))
    .then(saveResponseTokenAsCookie)
    .catch(pushResponseErrorToState(tree))
}

export default createFolderReportAction
