import assign from 'lodash/assign'
import {saveResponseTokenAsCookie, getApiFetchConfig, pushResponseErrorToState} from 'tetris-iso/utils'
import {POST} from '@tetris/http'
import compact from 'lodash/compact'

import {getDeepCursor} from '../functions/get-deep-cursor'

function createModule (company, report, module, config) {
  return POST(`${process.env.ADPEEK_API_URL}/company/${company}/report/${report}/module`,
    assign({body: module}, config))
}

export function createModuleReportAction (tree, {company, workspace, folder, report}, module) {
  const path = compact([
    'user',
    ['companies', company],
    workspace && ['workspaces', workspace],
    folder && ['folders', folder],
    ['reports', report],
    'modules'
  ])

  return createModule(company, report, module, getApiFetchConfig(tree))
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
