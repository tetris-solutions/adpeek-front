import {DELETE} from '@tetris/http'
import {saveResponseTokenAsCookie, getApiFetchConfig, pushResponseErrorToState} from 'tetris-iso/utils'
import {getDeepCursor} from '../functions/get-deep-cursor'

export function deleteWorkspace (workspace, config) {
  return DELETE(`${process.env.ADPEEK_API_URL}/workspace/${workspace}`, config)
}

export function deleteWorkspaceAction (tree, {company, workspace}) {
  return deleteWorkspace(workspace, getApiFetchConfig(tree))
    .then(saveResponseTokenAsCookie)
    .then(response => {
      tree.unset(getDeepCursor(tree, [
        'user',
        ['companies', company],
        ['workspaces', workspace]
      ]))

      return response
    })
    .catch(pushResponseErrorToState(tree))
}
