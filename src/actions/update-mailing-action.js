import assign from 'lodash/assign'
import {saveResponseTokenAsCookie, getApiFetchConfig, pushResponseErrorToState} from 'tetris-iso/utils'
import {PUT} from '@tetris/http'
import qs from 'query-string'
import {getDeepCursor} from '../functions/get-deep-cursor'
import compact from 'lodash/compact'

function updateMailing ({company, workspace, folder, report}, mailing, config) {
  const query = qs.stringify({workspace, folder, report})

  return PUT(`${process.env.ADPEEK_API_URL}/company/${company}/mailing/${mailing.id}?${query}`,
    assign({body: mailing}, config))
}

export function updateMailingReportAction (tree, params, mailing) {
  const cursor = getDeepCursor(tree, compact([
    'user',
    ['companies', params.company],
    params.workspace && ['workspaces', params.workspace],
    params.folder && ['folders', params.folder],
    params.report && ['reports', params.report],
    ['mailings', mailing.id]
  ]))

  tree.merge(cursor, mailing)

  return updateMailing(params, mailing, getApiFetchConfig(tree))
    .then(saveResponseTokenAsCookie)
    .catch(pushResponseErrorToState(tree))
}

export default updateMailingReportAction
