import {GET} from '@tetris/http'
import {saveResponseData} from '../functions/save-response-data'
import {getApiFetchConfig, saveResponseTokenAsCookie, pushResponseErrorToState} from '@tetris/front-server/utils'

function loadWorkspaceStats (id, updateMode, config) {
  const qs = updateMode !== 'normal'
    ? `?${updateMode}=true`
    : ''

  return GET(`${process.env.ADPEEK_API_URL}/workspace/${id}/stats${qs}`, config)
}

const statsRequestRegister = {}

export function loadWorkspaceStatsAction (tree, company, workspace, updateMode = 'normal') {
  statsRequestRegister[workspace] = statsRequestRegister[workspace] ||
    loadWorkspaceStats(workspace, updateMode, getApiFetchConfig(tree))
      .then(saveResponseTokenAsCookie)
      .then(saveResponseData(tree, [
        'user',
        ['companies', company],
        ['workspaces', workspace],
        'stats'
      ]))
      .catch(pushResponseErrorToState)

  return statsRequestRegister[workspace]
}
