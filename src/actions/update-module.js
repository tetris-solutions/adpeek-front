import {PUT} from '@tetris/http'
import assign from 'lodash/assign'
import {saveResponseTokenAsCookie} from '@tetris/front-server/lib/functions/save-token-as-cookie'
import {getApiFetchConfig} from '@tetris/front-server/lib/functions/get-api-fetch-config'
import {pushResponseErrorToState} from '@tetris/front-server/lib/functions/push-response-error-to-state'
import debounce from 'lodash/debounce'
import omit from 'lodash/omit'

function updateModule (module, folder, config) {
  return PUT(`${process.env.ADPEEK_API_URL}/module/${module.id}?folder=${folder}`,
    assign({body: module}, config))
}

const persist = debounce((moduleCursor, folder) =>
  updateModule(omit(moduleCursor.get(), 'result', 'query', 'isLoading'), folder, getApiFetchConfig(moduleCursor.tree))
    .then(saveResponseTokenAsCookie)
    .catch(pushResponseErrorToState(moduleCursor.tree)), 1000)

export function updateModuleAction (moduleCursor, folder, updatedModule) {
  moduleCursor.merge(updatedModule)
  moduleCursor.tree.commit()

  persist(moduleCursor, folder)
}

export default updateModuleAction
