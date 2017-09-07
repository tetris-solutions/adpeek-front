import assign from 'lodash/assign'
import {saveResponseTokenAsCookie, getApiFetchConfig, pushResponseErrorToState} from '@tetris/front-server/utils'
import {POST} from '@tetris/http'
import qs from 'query-string'

function createMailing ({company, workspace, folder, report}, mailing, config) {
  const query = qs.stringify({workspace, folder})

  return POST(`${process.env.ADPEEK_API_URL}/company/${company}/report/${report}/mailing?${query}`,
    assign({body: mailing}, config))
}

export function createMailingReportAction (tree, params, mailing) {
  return createMailing(params, mailing, getApiFetchConfig(tree))
    .then(saveResponseTokenAsCookie)
    .catch(pushResponseErrorToState(tree))
}

export default createMailingReportAction
