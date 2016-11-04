import {PUT} from '@tetris/http'
import assign from 'lodash/assign'
import {saveResponseTokenAsCookie, getApiFetchConfig, pushResponseErrorToState} from 'tetris-iso/utils'

function openReport (company, report, config) {
  return PUT(`${process.env.ADPEEK_API_URL}/company/${company}/report/${report}/open`,
    assign({body: {}}, config))
}

export function openReportAction (tree, {company}, report) {
  return openReport(company, report, getApiFetchConfig(tree))
    .then(saveResponseTokenAsCookie)
    .catch(pushResponseErrorToState(tree))
}

export default openReportAction
