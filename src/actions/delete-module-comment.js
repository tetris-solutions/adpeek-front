import {saveResponseTokenAsCookie, getApiFetchConfig, pushResponseErrorToState} from 'tetris-iso/utils'
import {DELETE} from '@tetris/http'
import compact from 'lodash/compact'
import {getDeepCursor} from '../functions/get-deep-cursor'

function deleteModuleComment (company, comment, config) {
  return DELETE(`${process.env.ADPEEK_API_URL}/company/${company}/comment/${comment}`, config)
}

export function deleteModuleAction (tree, params, moduleId, commentId) {
  return deleteModuleComment(params.company, commentId, getApiFetchConfig(tree))
    .then(saveResponseTokenAsCookie)
    .then(function onSuccess (response) {
      tree.unset(getDeepCursor(tree, compact([
        'user',
        ['companies', params.company],
        params.workspace && ['workspaces', params.workspace],
        params.folder && ['folders', params.folder],
        ['reports', params.report],
        'modules',
        moduleId,
        ['comments', commentId]
      ])))
      tree.commit()

      return response
    })
    .catch(pushResponseErrorToState(tree))
}

export default deleteModuleAction
