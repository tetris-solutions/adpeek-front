import {getApiFetchConfig} from '@tetris/front-server/lib/functions/get-api-fetch-config'
import {pushResponseErrorToState} from '@tetris/front-server/lib/functions/push-response-error-to-state'
import {saveResponseTokenAsCookie} from '@tetris/front-server/lib/functions/save-token-as-cookie'
import {DELETE} from '@tetris/http'

import {getDeepCursor} from '../functions/get-deep-cursor'

function deleteModule (module, config) {
  return DELETE(`${process.env.ADPEEK_API_URL}/module/${module}`, config)
}

export function deleteModuleAction (tree, params, moduleId) {
  return deleteModule(moduleId, getApiFetchConfig(tree))
    .then(saveResponseTokenAsCookie)
    .then(response => {
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
