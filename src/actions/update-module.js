import {PUT} from '@tetris/http'
import assign from 'lodash/assign'
import {saveResponseTokenAsCookie} from '@tetris/front-server/lib/functions/save-token-as-cookie'
import {getApiFetchConfig} from '@tetris/front-server/lib/functions/get-api-fetch-config'
import {pushResponseErrorToState} from '@tetris/front-server/lib/functions/push-response-error-to-state'
import debounce from 'lodash/debounce'
import omit from 'lodash/omit'

function updateModule (module, config) {
  return PUT(`${process.env.ADPEEK_API_URL}/module/${module.id}`,
    assign({body: module}, config))
}

const persist = debounce(moduleCursor =>
  updateModule(omit(moduleCursor.get(), 'result', 'query', 'isLoading'), getApiFetchConfig(moduleCursor.tree))
    .then(saveResponseTokenAsCookie)
    .catch(pushResponseErrorToState(moduleCursor.tree)), 1000)

export function updateModuleAction (moduleCursor, updatedModule) {
  moduleCursor.merge(updatedModule)
  moduleCursor.tree.commit()

  persist(moduleCursor)
}

export default updateModuleAction
