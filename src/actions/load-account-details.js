import {GET} from '@tetris/http'
import {saveResponseTokenAsCookie, getApiFetchConfig, pushResponseErrorToState} from 'tetris-iso/utils'
import {saveResponseData} from '../functions/save-response-data'

function loadAccountDetails (folder, fresh, config) {
  return GET(`${process.env.ADPEEK_API_URL}/folder/${folder}/account${fresh ? '?fresh=true' : ''}`, config)
}

export function loadAccountDetailsAction (tree, {company, workspace, folder}, fresh = false) {
  return loadAccountDetails(folder, fresh, getApiFetchConfig(tree))
    .then(saveResponseTokenAsCookie)
    .then(saveResponseData(tree, [
      'user',
      ['companies', company],
      ['workspaces', workspace],
      ['folders', folder],
      'account',
      'details'
    ]))
    .catch(pushResponseErrorToState(tree))
}
