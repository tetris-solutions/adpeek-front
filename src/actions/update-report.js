import {PUT} from '@tetris/http'
import assign from 'lodash/assign'
import {saveResponseTokenAsCookie, getApiFetchConfig, pushResponseErrorToState} from '@tetris/front-server/utils'
import {getDeepCursor} from '../functions/get-deep-cursor'
import compact from 'lodash/compact'

function updateReport (company, report, config) {
  return PUT(`${process.env.ADPEEK_API_URL}/company/${company}/report/${report.id}`,
    assign({body: report}, config))
}

export function updateReportAction (tree, {company, workspace, folder}, report) {
  const path = getDeepCursor(tree, compact([
    'user',
    ['companies', company],
    workspace && ['workspaces', workspace],
    folder && ['folders', folder],
    ['reports', report.id]
  ]))

  tree.merge(path, report)

  return updateReport(company, report, getApiFetchConfig(tree))
    .then(saveResponseTokenAsCookie)
    .catch(pushResponseErrorToState(tree))
}

export default updateReportAction
