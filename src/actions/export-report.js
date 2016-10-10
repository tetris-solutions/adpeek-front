import {POST} from '@tetris/http'
import assign from 'lodash/assign'
import {saveResponseTokenAsCookie, getApiFetchConfig, pushResponseErrorToState} from 'tetris-iso/utils'

function exportReport (workspace, type, report, config) {
  return POST(`${process.env.ADPEEK_API_URL}/workspace/${workspace}/report/${report.id}/export?type=${type}`,
    assign({body: report}, config))
}

export function exportReportAction (tree, {workspace}, type, report) {
  return exportReport(workspace, type, report, getApiFetchConfig(tree))
    .then(saveResponseTokenAsCookie)
    .catch(pushResponseErrorToState(tree))
}
