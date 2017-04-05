import {PUT} from '@tetris/http'
import {saveResponseTokenAsCookie, getApiFetchConfig, pushResponseErrorToState} from 'tetris-iso/utils'

function showWorkspace (workspace, config) {
  return PUT(`${process.env.ADPEEK_API_URL}/workspace/${workspace}/show`, config)
}

export function showWorkspaceAction (tree, {workspace}) {
  return showWorkspace(workspace, getApiFetchConfig(tree))
    .then(saveResponseTokenAsCookie)
    .catch(pushResponseErrorToState(tree))
}

