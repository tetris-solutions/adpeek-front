import {DELETE} from '@tetris/http'
import {saveResponseTokenAsCookie, getApiFetchConfig, pushResponseErrorToState} from '@tetris/front-server/utils'
import {getDeepCursor} from '../functions/get-deep-cursor'
import compact from 'lodash/compact'

function deleteReport (company, report, config) {
  return DELETE(`${process.env.ADPEEK_API_URL}/company/${company}/report/${report}`, (config))
}

export function deleteReportAction (tree, {company, workspace, folder}, report) {
  return deleteReport(company, report, getApiFetchConfig(tree))
    .then(saveResponseTokenAsCookie)
    .then(r => {
      tree.unset(getDeepCursor(tree, compact([
        'user',
        ['companies', company],
        workspace && ['workspaces', workspace],
        folder && ['folders', folder],
        ['reports', report]
      ])))
      tree.commit()
      return r
    })
    .catch(pushResponseErrorToState(tree))
}
