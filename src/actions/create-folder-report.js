import {POST} from '@tetris/http'
import assign from 'lodash/assign'
import {saveResponseTokenAsCookie, getApiFetchConfig, pushResponseErrorToState} from 'tetris-iso/utils'

function createFolderReport (folder, report, config) {
  return POST(`${process.env.ADPEEK_API_URL}/folder/${folder}/report`,
    assign({body: report}, config))
}

export function createFolderReportAction (tree, company, workspace, folder, report) {
  return createFolderReport(folder, report, getApiFetchConfig(tree))
    .then(saveResponseTokenAsCookie)
    .catch(pushResponseErrorToState(tree))
}

export default createFolderReportAction
