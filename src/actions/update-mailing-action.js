import assign from 'lodash/assign'
import {saveResponseTokenAsCookie, getApiFetchConfig, pushResponseErrorToState} from 'tetris-iso/utils'
import {PUT} from '@tetris/http'
import qs from 'query-string'

function updateMailing ({company, workspace, folder, report}, mailing, config) {
  const query = qs.stringify({workspace, folder, report})

  return PUT(`${process.env.ADPEEK_API_URL}/company/${company}/mailing/${mailing.id}?${query}`,
    assign({body: mailing}, config))
}

export function updateMailingReportAction (tree, params, mailing) {
  return updateMailing(params, mailing, getApiFetchConfig(tree))
    .then(saveResponseTokenAsCookie)
    .catch(pushResponseErrorToState(tree))
}

export default updateMailingReportAction
