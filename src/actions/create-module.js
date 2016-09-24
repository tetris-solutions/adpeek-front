import assign from 'lodash/assign'
import {getApiFetchConfig} from '@tetris/front-server/lib/functions/get-api-fetch-config'
import {pushResponseErrorToState} from '@tetris/front-server/lib/functions/push-response-error-to-state'
import {saveResponseTokenAsCookie} from '@tetris/front-server/lib/functions/save-token-as-cookie'
import {POST} from '@tetris/http'

import {getDeepCursor} from '../functions/get-deep-cursor'

function createModule (company, report, module, config) {
  return POST(`${process.env.ADPEEK_API_URL}/company/${company}/report/${report}/module`,
    assign({body: module}, config))
}

export function createModuleReportAction (tree, {company, workspace, folder, report}, module) {
  const path = ['user', ['companies', company]]

  if (workspace) path.push(['workspaces', workspace])
  if (folder) path.push(['folders', folder])

  path.push(['reports', report])
  path.push('modules')

  return createModule(company, report, module, getApiFetchConfig(tree))
    .then(saveResponseTokenAsCookie)
    .then(response => {
      path.push(response.data.id)

      const cursor = getDeepCursor(tree, path)

      tree.set(cursor, response.data)
      tree.commit()

      return response
    })
    .catch(pushResponseErrorToState(tree))
}

export default createModuleReportAction
