import assign from 'lodash/assign'
import {saveResponseTokenAsCookie, getApiFetchConfig, pushResponseErrorToState} from 'tetris-iso/utils'
import {PUT} from '@tetris/http'
import compact from 'lodash/compact'
import {getDeepCursor} from '../functions/get-deep-cursor'
import qs from 'query-string'

function cloneModule (params, module, newModule, config) {
  return PUT(`${process.env.ADPEEK_API_URL}/module/${module}/clone?${qs.stringify(params)}`,
    assign({body: newModule}, config))
}

export function cloneModuleAction (tree, params, module, newModule) {
  const {company, workspace, folder, report} = params

  const path = compact([
    'user',
    ['companies', company],
    workspace && ['workspaces', workspace],
    folder && ['folders', folder],
    ['reports', report],
    'modules'
  ])

  return cloneModule(params, module, newModule, getApiFetchConfig(tree))
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

