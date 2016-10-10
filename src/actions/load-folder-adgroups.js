import {GET} from '@tetris/http'
import {saveResponseTokenAsCookie, getApiFetchConfig, pushResponseErrorToState} from 'tetris-iso/utils'
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
