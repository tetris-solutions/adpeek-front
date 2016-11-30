import {GET} from '@tetris/http'
import {saveResponseData} from '../functions/save-response-data'
import {getApiFetchConfig, saveResponseTokenAsCookie, pushResponseErrorToState} from 'tetris-iso/utils'

function loadWorkspaceStats (id, config) {
  return GET(`${process.env.ADPEEK_API_URL}/workspace/${id}/stats`, config)
}

export function loadWorkspaceStatsAction (tree, company, workspace) {
  loadWorkspaceStats(workspace, getApiFetchConfig(tree))
    .then(saveResponseTokenAsCookie)
    .then(saveResponseData(tree, [
      'user',
      ['companies', company],
      ['workspaces', workspace],
      'stats'
    ]))
    .catch(pushResponseErrorToState)
}
