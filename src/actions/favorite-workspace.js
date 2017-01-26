import {PUT} from '@tetris/http'
import {saveResponseTokenAsCookie, getApiFetchConfig, pushResponseErrorToState} from 'tetris-iso/utils'
import {getDeepCursor} from '../functions/get-deep-cursor'

function favoriteWorkspace (workspace, config) {
  return PUT(`${process.env.ADPEEK_API_URL}/workspace/${workspace}/favorite`, config)
}

export function favoriteWorkspaceAction (tree, {company, workspace}) {
  return favoriteWorkspace(workspace, getApiFetchConfig(tree))
    .then(saveResponseTokenAsCookie)
    .then(response => {
      tree.merge(getDeepCursor(tree, [
        'user',
        ['companies', company],
        ['workspaces', workspace]
      ]), {favorite: true})

      return response
    })
    .catch(pushResponseErrorToState(tree))
}

