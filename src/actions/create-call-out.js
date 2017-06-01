import {POST} from '@tetris/http'
import {saveResponseTokenAsCookie, getApiFetchConfig, pushResponseErrorToState} from 'tetris-iso/utils'
import assign from 'lodash/assign'
import {saveResponseData} from '../functions/save-response-data'
import concat from 'lodash/concat'

function createCallOutExtension (folder, feed, callOut, config) {
  return POST(`${process.env.ADPEEK_API_URL}/folder/${folder}/feed/${feed}/extension/call-out`, assign({body: callOut}, config))
}

const push = (newCallOut, ls) => concat(ls, newCallOut)

export function createCallOutExtensionAction (tree, {company, workspace, folder}, feedId, callOut) {
  return createCallOutExtension(folder, feedId, callOut, getApiFetchConfig(tree))
    .then(saveResponseTokenAsCookie)
    .then(saveResponseData(tree, [
      'user',
      ['companies', company],
      ['workspaces', workspace],
      ['folders', folder],
      'callOuts'
    ], push))
    .catch(pushResponseErrorToState(tree))
}
