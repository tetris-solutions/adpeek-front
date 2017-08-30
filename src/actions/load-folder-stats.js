import {GET} from '@tetris/http'
import {mergeResponseData} from '../functions/save-response-data'
import {getApiFetchConfig, saveResponseTokenAsCookie, pushResponseErrorToState} from 'tetris-iso/utils'

function loadFolderStats (id, updateMode, config) {
  const qs = updateMode !== 'normal'
    ? `?${updateMode}=true`
    : ''

  return GET(`${process.env.ADPEEK_API_URL}/folder/${id}/stats${qs}`, config)
}

export function loadFolderStatsAction (tree, {company, workspace}, folder, updateMode = 'normal') {
  return loadFolderStats(folder, updateMode, getApiFetchConfig(tree))
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
