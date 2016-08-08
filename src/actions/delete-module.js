import {DELETE} from '@tetris/http'
import {saveResponseTokenAsCookie} from '@tetris/front-server/lib/functions/save-token-as-cookie'
import {getApiFetchConfig} from '@tetris/front-server/lib/functions/get-api-fetch-config'
import {pushResponseErrorToState} from '@tetris/front-server/lib/functions/push-response-error-to-state'

export function deleteModule (module, config) {
  return DELETE(`${process.env.ADPEEK_API_URL}/module/${module}`, config)
}

export function deleteModuleAction (tree, module) {
  return deleteModule(module, getApiFetchConfig(tree))
    .then(saveResponseTokenAsCookie)
    .catch(pushResponseErrorToState(tree))
}

export default deleteModuleAction
