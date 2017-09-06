import assign from 'lodash/assign'
import {saveResponseTokenAsCookie, getApiFetchConfig, pushResponseErrorToState} from 'tetris-iso/utils'
import {PUT} from '@tetris/http'
import compact from 'lodash/compact'
import {getDeepCursor} from '../functions/get-deep-cursor'
import qs from 'query-string'
import {touchReport} from './touch-report'

function cloneModule (params, module, newModule, config) {
  return PUT(`${process.env.ADPEEK_API_URL}/module/${module}/clone?${qs.stringify(params)}`,
    assign({body: newModule}, config))
}

export function cloneModuleAction (tree, params, module, newModule) {
  const {company, workspace, folder, report} = params

  return cloneModule(params, module, newModule, getApiFetchConfig(tree))
    .then(saveResponseTokenAsCookie)
    .then(function onSuccess (response) {
      const modulesCursor = getDeepCursor(tree, compact([
        'user',
        ['companies', company],
        workspace && ['workspaces', workspace],
        folder && ['folders', folder],
        ['reports', report],
        'modules'
      ]))

      tree.push(modulesCursor, response.data)
      touchReport(tree, params)
      tree.commit()

      return response
    })
    .catch(pushResponseErrorToState(tree))
}
