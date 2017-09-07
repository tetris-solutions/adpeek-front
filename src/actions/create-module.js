import assign from 'lodash/assign'
import {saveResponseTokenAsCookie, getApiFetchConfig, pushResponseErrorToState} from '@tetris/front-server/utils'
import {POST} from '@tetris/http'
import compact from 'lodash/compact'
import {inferLevelFromParams} from '../functions/infer-level-from-params'
import {getDeepCursor} from '../functions/get-deep-cursor'
import {touchReport} from './touch-report'

function createModule (entity, entityId, report, module, config) {
  return POST(`${process.env.ADPEEK_API_URL}/${entity}/${entityId}/report/${report}/module`,
    assign({body: module}, config))
}

export function createModuleReportAction (tree, params, module) {
  const {company, workspace, folder, report} = params
  const level = inferLevelFromParams(params)

  return createModule(level, params[level], report, module, getApiFetchConfig(tree))
    .then(saveResponseTokenAsCookie)
    .then(function onSuccess (response) {
      const modulesCursor = getDeepCursor(tree, compact([
        'user',
        ['companies', company],
        workspace && ['workspaces', workspace],
        folder && ['folders', folder],
        ['reports', report],
        'modules'
      ]))

      response.data.blank = true

      tree.push(modulesCursor, response.data)
      touchReport(tree, params)
      tree.commit()

      return response
    })
    .catch(pushResponseErrorToState(tree))
}
