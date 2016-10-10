import {DELETE} from '@tetris/http'
import {saveResponseTokenAsCookie, getApiFetchConfig, pushResponseErrorToState} from 'tetris-iso/utils'

function deleteReport (workspace, report, config) {
  return DELETE(`${process.env.ADPEEK_API_URL}/workspace/${workspace}/report/${report}`, (config))
}

export function deleteReportAction (tree, {workspace}, report) {
  return deleteReport(workspace, report, getApiFetchConfig(tree))
    .then(saveResponseTokenAsCookie)
    .catch(pushResponseErrorToState(tree))
}

export default deleteReportAction
