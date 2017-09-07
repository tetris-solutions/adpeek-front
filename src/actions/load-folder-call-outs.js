import {GET} from '@tetris/http'
import {saveResponseData} from '../functions/save-response-data'
import {getApiFetchConfig, saveResponseTokenAsCookie, pushResponseErrorToState} from '@tetris/front-server/utils'

function loadFolderCallOuts (folder, config) {
  return GET(`${process.env.ADPEEK_API_URL}/folder/${folder}/extension/call-outs`, config)
}

export function loadFolderCallOutsAction (tree, {company, workspace, folder}) {
  return loadFolderCallOuts(folder, getApiFetchConfig(tree))
    .then(saveResponseTokenAsCookie)
    .then(saveResponseData(tree, [
      'user',
      ['companies', company],
      ['workspaces', workspace],
      ['folders', folder],
      'callOuts'
    ]))
    .catch(pushResponseErrorToState)
}
