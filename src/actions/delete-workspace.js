import {DELETE} from '@tetris/http'
import {saveResponseTokenAsCookie, getApiFetchConfig, pushResponseErrorToState} from 'tetris-iso/utils'

export function deleteWorkspace (workspace, config) {
  return DELETE(`${process.env.ADPEEK_API_URL}/workspace/${workspace}`, config)
}

export function deleteWorkspaceAction (tree, workspace) {
  return deleteWorkspace(workspace, getApiFetchConfig(tree))
    .then(saveResponseTokenAsCookie)
    .catch(pushResponseErrorToState(tree))
}

export default deleteWorkspaceAction
