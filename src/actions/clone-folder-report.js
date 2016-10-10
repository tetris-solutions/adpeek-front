import {PUT} from '@tetris/http'
import assign from 'lodash/assign'
import {saveResponseTokenAsCookie, getApiFetchConfig, pushResponseErrorToState} from 'tetris-iso/utils'

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
