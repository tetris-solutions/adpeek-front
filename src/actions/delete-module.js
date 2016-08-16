import {DELETE} from '@tetris/http'
import {saveResponseTokenAsCookie} from '@tetris/front-server/lib/functions/save-token-as-cookie'
import {getApiFetchConfig} from '@tetris/front-server/lib/functions/get-api-fetch-config'
import {pushResponseErrorToState} from '@tetris/front-server/lib/functions/push-response-error-to-state'

function deleteModule (module, config) {
  return DELETE(`${process.env.ADPEEK_API_URL}/module/${module}`, config)
}

export function deleteModuleAction (moduleCursor) {
  return deleteModule(moduleCursor.get('id'), getApiFetchConfig(moduleCursor.tree))
    .then(saveResponseTokenAsCookie)
    .then(response => {
      moduleCursor.unset()
      moduleCursor.tree.commit()

      return response
    })
    .catch(pushResponseErrorToState(moduleCursor.tree))
}

export default deleteModuleAction
