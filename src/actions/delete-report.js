import {DELETE} from '@tetris/http'
import {saveResponseTokenAsCookie, getApiFetchConfig, pushResponseErrorToState} from 'tetris-iso/utils'

function deleteReport (company, report, config) {
  return DELETE(`${process.env.ADPEEK_API_URL}/company/${company}/report/${report}`, (config))
}

export function deleteReportAction (tree, {company}, report) {
  return deleteReport(company, report, getApiFetchConfig(tree))
    .then(saveResponseTokenAsCookie)
    .catch(pushResponseErrorToState(tree))
}

export default deleteReportAction
