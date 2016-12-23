import {GET} from '@tetris/http'
import {saveResponseData} from '../functions/save-response-data'
import {getApiFetchConfig, saveResponseTokenAsCookie, pushResponseErrorToState} from 'tetris-iso/utils'

function loadFolderStats (id, requestFreshStats, config) {
  const qs = requestFreshStats ? '?fresh=true' : ''

  return GET(`${process.env.ADPEEK_API_URL}/folder/${id}/stats${qs}`, config)
}

const statsRequestRegister = {}

export function loadFolderStatsAction (tree, {company, workspace}, folder, requestFreshStats = false) {
  statsRequestRegister[folder] = statsRequestRegister[folder] ||
    loadFolderStats(folder, requestFreshStats, getApiFetchConfig(tree))
      .then(saveResponseTokenAsCookie)
      .then(saveResponseData(tree, [
        'user',
        ['companies', company],
        ['workspaces', workspace],
        ['folders', folder],
        'stats'
      ]))
      .catch(pushResponseErrorToState)

  return statsRequestRegister[folder]
}
