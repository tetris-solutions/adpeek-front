import {GET} from '@tetris/http'
import {saveResponseData} from '../functions/save-response-data'
import {getApiFetchConfig, saveResponseTokenAsCookie, pushResponseErrorToState} from '@tetris/front-server/utils'

function loadFolderSiteLinks (folder, config) {
  return GET(`${process.env.ADPEEK_API_URL}/folder/${folder}/extension/site-links`, config)
}

export function loadFolderSiteLinksAction (tree, {company, workspace, folder}) {
  return loadFolderSiteLinks(folder, getApiFetchConfig(tree))
    .then(saveResponseTokenAsCookie)
    .then(saveResponseData(tree, [
      'user',
      ['companies', company],
      ['workspaces', workspace],
      ['folders', folder],
      'siteLinks'
    ]))
    .catch(pushResponseErrorToState)
}
