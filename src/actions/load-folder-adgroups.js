import {GET} from '@tetris/http'
import {saveResponseTokenAsCookie} from '@tetris/front-server/lib/functions/save-token-as-cookie'
import {getApiFetchConfig} from '@tetris/front-server/lib/functions/get-api-fetch-config'
import {pushResponseErrorToState} from '@tetris/front-server/lib/functions/push-response-error-to-state'
import {saveResponseData} from '../functions/save-response-data'

export function loadFolderAdGroups (folder, config) {
  return GET(`${process.env.ADPEEK_API_URL}/folder/${folder}/adgroups`, config)
}

export function loadFolderAdGroupsAction (tree, company, workspace, folder, token) {
  return loadFolderAdGroups(folder, getApiFetchConfig(tree, token))
    .then(saveResponseTokenAsCookie)
    .then(saveResponseData(tree, [
      'user',
      ['companies', company],
      ['workspaces', workspace],
      ['folders', folder],
      'adGroups'
    ]))
    .catch(pushResponseErrorToState(tree))
}
