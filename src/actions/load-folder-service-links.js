import {GET} from '@tetris/http'
import {saveResponseData} from '../functions/save-response-data'
import {getApiFetchConfig, saveResponseTokenAsCookie, pushResponseErrorToState} from '@tetris/front-server/utils'

function loadFolderServiceLinks (folder, config) {
  return GET(`${process.env.ADPEEK_API_URL}/folder/${folder}/service-links`, config)
}

export function loadFolderServiceLinksAction (tree, {company, workspace, folder}) {
  return loadFolderServiceLinks(folder, getApiFetchConfig(tree))
    .then(saveResponseTokenAsCookie)
    .then(saveResponseData(tree, [
      'user',
      ['companies', company],
      ['workspaces', workspace],
      ['folders', folder],
      'serviceLinks'
    ]))
    .catch(pushResponseErrorToState)
}
