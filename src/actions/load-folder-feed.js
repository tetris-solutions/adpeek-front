import {GET} from '@tetris/http'
import {saveResponseData} from '../functions/save-response-data'
import {getApiFetchConfig, saveResponseTokenAsCookie, pushResponseErrorToState} from 'tetris-iso/utils'

function loadFolderFeed (folder, config) {
  return GET(`${process.env.ADPEEK_API_URL}/folder/${folder}/feed`, config)
}

export function loadFolderFeedAction (tree, {company, workspace, folder}) {
  return loadFolderFeed(folder, getApiFetchConfig(tree))
    .then(saveResponseTokenAsCookie)
    .then(saveResponseData(tree, [
      'user',
      ['companies', company],
      ['workspaces', workspace],
      ['folders', folder],
      'feed'
    ]))
    .catch(pushResponseErrorToState)
}
