import {saveResponseTokenAsCookie, getApiFetchConfig, pushResponseErrorToState} from 'tetris-iso/utils'
import {DELETE} from '@tetris/http'

import {getDeepCursor} from '../functions/get-deep-cursor'

function deleteModule (workspace, module, config) {
  return DELETE(`${process.env.ADPEEK_API_URL}/workspace/${workspace}/module/${module}`, config)
}

export function deleteModuleAction (tree, params, moduleId) {
  return deleteModule(params.workspace, moduleId, getApiFetchConfig(tree))
    .then(saveResponseTokenAsCookie)
    .then(function onSuccess (response) {
      tree.unset(getDeepCursor(tree, [
        'user',
        ['companies', params.company],
        ['workspaces', params.workspace],
        ['folders', params.folder],
        ['reports', params.report],
        'modules',
        moduleId
      ]))
      tree.commit()

      return response
    })
    .catch(pushResponseErrorToState(tree))
}

export default deleteModuleAction
