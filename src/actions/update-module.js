import {PUT} from '@tetris/http'
import assign from 'lodash/assign'
import {saveResponseTokenAsCookie} from '@tetris/front-server/lib/functions/save-token-as-cookie'
import {getApiFetchConfig} from '@tetris/front-server/lib/functions/get-api-fetch-config'
import {pushResponseErrorToState} from '@tetris/front-server/lib/functions/push-response-error-to-state'

function updateModule (module, config) {
  return PUT(`${process.env.ADPEEK_API_URL}/module/${module.id}`,
    assign({body: module}, config))
}

export function updateModuleAction (tree, module) {
  return updateModule(module, getApiFetchConfig(tree))
    .then(saveResponseTokenAsCookie)
    .catch(pushResponseErrorToState(tree))
}

export default updateModuleAction
