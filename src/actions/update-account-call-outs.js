import {PUT} from '@tetris/http'
import assign from 'lodash/assign'
import {saveResponseTokenAsCookie, getApiFetchConfig, pushResponseErrorToState} from 'tetris-iso/utils'

function updateAccountCallOuts (folder, callOuts, config) {
  return PUT(`${process.env.ADPEEK_API_URL}/folder/${folder}/extension/call-outs`, assign({body: callOuts}, config))
}

export function updateAccountCallOutsAction (tree, {folder}, callOuts) {
  return updateAccountCallOuts(folder, callOuts, getApiFetchConfig(tree))
    .then(saveResponseTokenAsCookie)
    .catch(pushResponseErrorToState(tree))
}
