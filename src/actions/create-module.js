import assign from 'lodash/assign'
import {saveResponseTokenAsCookie, getApiFetchConfig, pushResponseErrorToState} from 'tetris-iso/utils'
import {POST} from '@tetris/http'

import {getDeepCursor} from '../functions/get-deep-cursor'

function createModule (workspace, report, module, config) {
  return POST(`${process.env.ADPEEK_API_URL}/workspace/${workspace}/report/${report}/module`,
    assign({body: module}, config))
}

export function createModuleReportAction (tree, {company, workspace, folder, report}, module) {
  const path = [
    'user',
    ['companies', company],
    ['workspaces', workspace]
  ]

  if (folder) path.push(['folders', folder])

  path.push(['reports', report])
  path.push('modules')

  return createModule(workspace, report, module, getApiFetchConfig(tree))
    .then(saveResponseTokenAsCookie)
    .then(function onSuccess (response) {
      path.push(response.data.id)

      const cursor = getDeepCursor(tree, path)

      tree.set(cursor, response.data)
      tree.commit()

      return response
    })
    .catch(pushResponseErrorToState(tree))
}

export default createModuleReportAction
