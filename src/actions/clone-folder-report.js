import {PUT} from '@tetris/http'
import assign from 'lodash/assign'
import {saveResponseTokenAsCookie} from '@tetris/front-server/lib/functions/save-token-as-cookie'
import {getApiFetchConfig} from '@tetris/front-server/lib/functions/get-api-fetch-config'
import {pushResponseErrorToState} from '@tetris/front-server/lib/functions/push-response-error-to-state'

function cloneFolderReport (folder, report, config) {
  return PUT(`${process.env.ADPEEK_API_URL}/folder/${folder}/report/${report.id}/clone`,
    assign({body: report}, config))
}

export function cloneFolderReportAction (tree, company, workspace, folder, report) {
  return cloneFolderReport(folder, report, getApiFetchConfig(tree))
    .then(saveResponseTokenAsCookie)
    .catch(pushResponseErrorToState(tree))
}

export default cloneFolderReportAction
