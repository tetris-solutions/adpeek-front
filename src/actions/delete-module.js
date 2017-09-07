import {saveResponseTokenAsCookie, getApiFetchConfig, pushResponseErrorToState} from '@tetris/front-server/utils'
import {DELETE} from '@tetris/http'
import compact from 'lodash/compact'
import {getDeepCursor} from '../functions/get-deep-cursor'
import {touchReport} from './touch-report'

function deleteModule (company, module, config) {
  return DELETE(`${process.env.ADPEEK_API_URL}/company/${company}/module/${module}`, config)
}

export function deleteModuleAction (tree, params, moduleId) {
  return deleteModule(params.company, moduleId, getApiFetchConfig(tree))
    .then(saveResponseTokenAsCookie)
    .then(function onSuccess (response) {
      tree.unset(getDeepCursor(tree, compact([
        'user',
        ['companies', params.company],
        params.workspace && ['workspaces', params.workspace],
        params.folder && ['folders', params.folder],
        ['reports', params.report],
        ['modules', moduleId]
      ])))

      touchReport(tree, params)
      tree.commit()

      return response
    })
    .catch(pushResponseErrorToState(tree))
}

export default deleteModuleAction
