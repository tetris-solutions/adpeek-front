import {GET} from '@tetris/http'
import {saveResponseData} from '../functions/save-response-data'
import {getApiFetchConfig, saveResponseTokenAsCookie, pushResponseErrorToState} from '@tetris/front-server/utils'

function loadFolderUserLists (folder, config) {
  return GET(`${process.env.ADPEEK_API_URL}/folder/${folder}/user-lists`, config)
}

export function loadFolderUserListsAction (tree, {company, workspace, folder}) {
  return loadFolderUserLists(folder, getApiFetchConfig(tree))
    .then(saveResponseTokenAsCookie)
    .then(saveResponseData(tree, [
      'user',
      ['companies', company],
      ['workspaces', workspace],
      ['folders', folder],
      'userLists'
    ]))
    .catch(pushResponseErrorToState)
}
