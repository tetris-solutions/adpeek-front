import {PUT} from '@tetris/http'
import {saveResponseTokenAsCookie, getApiFetchConfig, pushResponseErrorToState} from 'tetris-iso/utils'
import assign from 'lodash/assign'

function setFolderReport (folder, report, favorite, config) {
  return PUT(`${process.env.ADPEEK_API_URL}/folder/${folder}/report/${report}${favorite ? '/favorite' : '/default'}`,
    assign({body: {}}, config))
}

export function setFolderReportAction (tree, folder, report, favorite = false) {
  return setFolderReport(folder, report, favorite, getApiFetchConfig(tree))
    .then(saveResponseTokenAsCookie)
    .catch(pushResponseErrorToState(tree))
}

export default setFolderReportAction
