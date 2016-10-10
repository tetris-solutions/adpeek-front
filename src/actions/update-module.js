import assign from 'lodash/assign'
import debounce from 'lodash/debounce'
import omit from 'lodash/omit'
import {saveResponseTokenAsCookie, getApiFetchConfig, pushResponseErrorToState} from 'tetris-iso/utils'
import {PUT} from '@tetris/http'

import {getDeepCursor} from '../functions/get-deep-cursor'

function updateModule (module, folder, config) {
  return PUT(`${process.env.ADPEEK_API_URL}/folder/${folder}/module/${module.id}`,
    assign({body: module}, config))
}

const persist = debounce((tree, params, moduleId) => {
  const cursorPath = getDeepCursor(tree, [
    'user',
    ['companies', params.company],
    ['workspaces', params.workspace],
    ['folders', params.folder],
    ['reports', params.report],
    'modules',
    moduleId
  ])

  const moduleChanges = omit(tree.get(cursorPath), 'result', 'query', 'isLoading')

  updateModule(moduleChanges, params.folder, getApiFetchConfig(tree))
    .then(saveResponseTokenAsCookie)
    .catch(pushResponseErrorToState(tree))
}, 1000)

export function updateModuleAction (tree, params, moduleId, moduleChanges, persistChanges = false) {
  const cursorPath = getDeepCursor(tree, [
    'user',
    ['companies', params.company],
    ['workspaces', params.workspace],
    ['folders', params.folder],
    ['reports', params.report],
    'modules',
    moduleId
  ])

  tree.merge(cursorPath, moduleChanges)
  tree.commit()

  if (persistChanges) {
    persist(tree, params, moduleId)
  }
}

export default updateModuleAction
