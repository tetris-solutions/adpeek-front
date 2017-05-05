import {GET} from '@tetris/http'
import {mergeResponseData} from '../functions/save-response-data'
import {getApiFetchConfig, saveResponseTokenAsCookie, pushResponseErrorToState} from 'tetris-iso/utils'

function loadFolderStats (id, requestFreshStats, config) {
  const qs = requestFreshStats ? '?fresh=true' : ''

  return GET(`${process.env.ADPEEK_API_URL}/folder/${id}/stats${qs}`, config)
}

export function loadFolderStatsAction (tree, {company, workspace}, folder, requestFreshStats = false) {
  // @todo delete this
  if (window.sessionStorage.getItem('cardStats') !== 'enabled') {
    return Promise.resolve()
  }

  return loadFolderStats(folder, requestFreshStats, getApiFetchConfig(tree))
    .then(saveResponseTokenAsCookie)
    .then(mergeResponseData(tree, [
      'user',
      ['companies', company],
      ['workspaces', workspace],
      ['folders', folder],
      'stats'
    ]))
    .catch(pushResponseErrorToState)
}
