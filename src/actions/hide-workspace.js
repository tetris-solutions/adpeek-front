import {PUT} from '@tetris/http'
import {saveResponseTokenAsCookie, getApiFetchConfig, pushResponseErrorToState} from 'tetris-iso/utils'

function hideWorkspace (workspace, config) {
  return PUT(`${process.env.ADPEEK_API_URL}/workspace/${workspace}/hide`, config)
}

export function hideWorkspaceAction (tree, {workspace}) {
  return hideWorkspace(workspace, getApiFetchConfig(tree))
    .then(saveResponseTokenAsCookie)
    .catch(pushResponseErrorToState(tree))
}
