import assign from 'lodash/assign'
import {saveResponseTokenAsCookie, getApiFetchConfig, pushResponseErrorToState} from 'tetris-iso/utils'
import {POST} from '@tetris/http'
import compact from 'lodash/compact'
import {inferLevelFromParams} from '../functions/infer-level-from-params'
import {getDeepCursor} from '../functions/get-deep-cursor'

function createModuleComment (entity, entityId, module, comment, config) {
  return POST(`${process.env.ADPEEK_API_URL}/module/${module}/comment?${entity}=${entityId}`, assign({body: comment}, config))
}

export function createModuleCommentAction (tree, params, module, comment) {
  const {company, workspace, folder, report} = params

  const level = inferLevelFromParams(params)

  return createModuleComment(level, params[level], module, comment, getApiFetchConfig(tree))
    .then(saveResponseTokenAsCookie)
    .then(function onSuccess (response) {
      const path = compact([
        'user',
        ['companies', company],
        workspace && ['workspaces', workspace],
        folder && ['folders', folder],
        ['reports', report],
        ['modules', module],
        ['comments', response.data.id]
      ])

      const cursor = getDeepCursor(tree, path)

      tree.set(cursor, response.data)
      tree.commit()

      return response
    })
    .catch(pushResponseErrorToState(tree))
}
