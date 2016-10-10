import {GET} from '@tetris/http'
import {saveResponseTokenAsCookie, getApiFetchConfig, pushResponseErrorToState} from 'tetris-iso/utils'
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
