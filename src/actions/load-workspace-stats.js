import {GET} from '@tetris/http'
import {saveResponseData} from '../functions/save-response-data'
import {getApiFetchConfig, saveResponseTokenAsCookie, pushResponseErrorToState} from 'tetris-iso/utils'

function loadWorkspaceStats (id, requestFreshStats, config) {
  const qs = requestFreshStats ? '?fresh=true' : ''

  return GET(`${process.env.ADPEEK_API_URL}/workspace/${id}/stats${qs}`, config)
}

export function loadWorkspaceStatsAction (tree, company, workspace, requestFreshStats = false) {
  loadWorkspaceStats(workspace, requestFreshStats, getApiFetchConfig(tree))
    .then(saveResponseTokenAsCookie)
    .then(saveResponseData(tree, [
      'user',
      ['companies', company],
      ['workspaces', workspace],
      'stats'
    ]))
    .catch(pushResponseErrorToState)
}
