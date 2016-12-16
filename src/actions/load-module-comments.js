import {GET} from '@tetris/http'
import {saveResponseTokenAsCookie, getApiFetchConfig, pushResponseErrorToState} from 'tetris-iso/utils'
import {saveResponseData} from '../functions/save-response-data'
import {inferLevelFromParams} from '../functions/infer-level-from-params'
import compact from 'lodash/compact'
import qs from 'query-string'

function loadModuleComments (query, module, config) {
  return GET(`${process.env.ADPEEK_API_URL}/module/${module}/comments?${qs.stringify(query)}`, config)
}

export function loadModuleCommentsAction (tree, params, {from, to}, module) {
  const level = inferLevelFromParams(params)
  const query = {[level]: params[level], from, to}

  return loadModuleComments(query, module, getApiFetchConfig(tree))
    .then(saveResponseTokenAsCookie)
    .then(saveResponseData(tree, compact([
      'user',
      ['companies', params.company],
      params.workspace && ['workspaces', params.workspace],
      params.folder && ['folders', params.folder],
      ['reports', params.report],
      'modules',
      module,
      'comments'
    ])))
    .catch(pushResponseErrorToState(tree))
}
