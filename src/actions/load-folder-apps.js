import {GET} from '@tetris/http'
import {saveResponseData} from '../functions/save-response-data'
import {getApiFetchConfig, saveResponseTokenAsCookie, pushResponseErrorToState} from 'tetris-iso/utils'

function loadFolderApps (folder, config) {
  return GET(`${process.env.ADPEEK_API_URL}/folder/${folder}/extension/apps`, config)
}

export function loadFolderAppsAction (tree, {company, workspace, folder}) {
  return loadFolderApps(folder, getApiFetchConfig(tree))
    .then(saveResponseTokenAsCookie)
    .then(saveResponseData(tree, [
      'user',
      ['companies', company],
      ['workspaces', workspace],
      ['folders', folder],
      'apps'
    ]))
    .catch(pushResponseErrorToState)
}
