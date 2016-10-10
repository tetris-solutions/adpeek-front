import {PUT} from '@tetris/http'
import assign from 'lodash/assign'
import {saveResponseTokenAsCookie, getApiFetchConfig, pushResponseErrorToState} from 'tetris-iso/utils'

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
