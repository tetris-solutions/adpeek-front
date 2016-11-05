import {POST} from '@tetris/http'
import assign from 'lodash/assign'
import {saveResponseTokenAsCookie, getApiFetchConfig, pushResponseErrorToState} from 'tetris-iso/utils'

function exportReport (company, type, report, config) {
  return POST(`${process.env.ADPEEK_API_URL}/company/${company}/report/${report.id}/export?type=${type}`,
    assign({body: report}, config))
}

export function exportReportAction (tree, {company}, type, report) {
  return exportReport(company, type, report, getApiFetchConfig(tree))
    .then(saveResponseTokenAsCookie)
    .catch(pushResponseErrorToState(tree))
}
