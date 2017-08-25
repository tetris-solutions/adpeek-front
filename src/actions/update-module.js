import assign from 'lodash/assign'
import debounce from 'lodash/debounce'
import omit from 'lodash/omit'
import {saveResponseTokenAsCookie, getApiFetchConfig, pushResponseErrorToState} from 'tetris-iso/utils'
import {PUT} from '@tetris/http'
import compact from 'lodash/compact'
import {inferLevelFromParams} from '../functions/infer-level-from-params'
import {getDeepCursor} from '../functions/get-deep-cursor'

function updateModule (module, level, id, config) {
  return PUT(`${process.env.ADPEEK_API_URL}/${level}/${id}/module/${module.id}`,
    assign({body: module}, config))
}

function sendModuleChanges (tree, params, moduleId) {
  const cursorPath = getDeepCursor(tree, compact([
    'user',
    ['companies', params.company],
    params.workspace && ['workspaces', params.workspace],
    params.folder && ['folders', params.folder],
    ['reports', params.report],
    ['modules', moduleId]
  ]))
  const level = inferLevelFromParams(params)
  const moduleChanges = omit(tree.get(cursorPath), 'result', 'query', 'isLoading', 'cropped')

  updateModule(moduleChanges, level, params[level], getApiFetchConfig(tree))
    .then(saveResponseTokenAsCookie)
    .catch(pushResponseErrorToState(tree))
}

const persist = debounce(sendModuleChanges, 1000)

export function updateModuleAction (tree, params, moduleId, moduleChanges, persistChanges = false) {
  const cursorPath = getDeepCursor(tree, compact([
    'user',
    ['companies', params.company],
    params.workspace && ['workspaces', params.workspace],
    params.folder && ['folders', params.folder],
    ['reports', params.report],
    ['modules', moduleId]
  ]))

  tree.merge(cursorPath, moduleChanges)
  tree.merge(cursorPath, {blank: false})
  tree.commit()

  if (persistChanges) {
    persist(tree, params, moduleId)
  }
}

export default updateModuleAction
