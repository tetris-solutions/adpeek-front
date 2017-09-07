import {DELETE} from '@tetris/http'
import {saveResponseTokenAsCookie, getApiFetchConfig, pushResponseErrorToState} from '@tetris/front-server/utils'
import {getDeepCursor} from '../functions/get-deep-cursor'

function unfavoriteWorkspace (workspace, config) {
  return DELETE(`${process.env.ADPEEK_API_URL}/workspace/${workspace}/favorite`, config)
}

export function unfavoriteWorkspaceAction (tree, {company, workspace}) {
  return unfavoriteWorkspace(workspace, getApiFetchConfig(tree))
    .then(saveResponseTokenAsCookie)
    .then(response => {
      tree.merge(getDeepCursor(tree, [
        'user',
        ['companies', company],
        ['workspaces', workspace]
      ]), {favorite: false})

      return response
    })
    .catch(pushResponseErrorToState(tree))
}
