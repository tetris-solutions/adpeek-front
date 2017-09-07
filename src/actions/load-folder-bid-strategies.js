import {GET} from '@tetris/http'
import {saveResponseData} from '../functions/save-response-data'
import {getApiFetchConfig, saveResponseTokenAsCookie, pushResponseErrorToState} from '@tetris/front-server/utils'

function loadFolderBidStrategies (folder, config) {
  return GET(`${process.env.ADPEEK_API_URL}/folder/${folder}/bid-strategies`, config)
}

export function loadFolderBidStrategiesAction (tree, {company, workspace, folder}) {
  return loadFolderBidStrategies(folder, getApiFetchConfig(tree))
    .then(saveResponseTokenAsCookie)
    .then(saveResponseData(tree, [
      'user',
      ['companies', company],
      ['workspaces', workspace],
      ['folders', folder],
      'bidStrategies'
    ]))
    .catch(pushResponseErrorToState)
}
