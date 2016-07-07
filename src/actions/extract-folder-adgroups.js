import {GET} from '@tetris/http'
import {saveResponseTokenAsCookie} from '@tetris/front-server/lib/functions/save-token-as-cookie'
import {getApiFetchConfig} from '@tetris/front-server/lib/functions/get-api-fetch-config'
import {pushResponseErrorToState} from '@tetris/front-server/lib/functions/push-response-error-to-state'
import {saveResponseData} from '../functions/save-response-data'

export function extractFolderAdGroups (folder, config) {
  return GET(`${process.env.ADPEEK_API_URL}/folder/${folder}/adgroups?report`, config)
}

export function extractFolderAdGroupsAction (tree, company, workspace, folder, token) {
  return extractFolderAdGroups(folder, getApiFetchConfig(tree, token))
    .then(saveResponseTokenAsCookie)
    .then(saveResponseData(tree, [
      'user',
      ['companies', company],
      ['workspaces', workspace],
      ['folders', folder],
      'adGroupsReport'
    ]))
    .catch(pushResponseErrorToState(tree))
}
