import {DELETE} from '@tetris/http'
import {saveResponseTokenAsCookie, getApiFetchConfig, pushResponseErrorToState} from 'tetris-iso/utils'

function unfavoriteWorkspace (workspace, config) {
  return DELETE(`${process.env.ADPEEK_API_URL}/workspace/${workspace}/favorite`, config)
}

export function unfavoriteWorkspaceAction (tree, workspace) {
  return unfavoriteWorkspace(workspace, getApiFetchConfig(tree))
    .then(saveResponseTokenAsCookie)
    .catch(pushResponseErrorToState(tree))
}
