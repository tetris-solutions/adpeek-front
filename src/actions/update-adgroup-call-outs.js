import {PUT} from '@tetris/http'
import assign from 'lodash/assign'
import {saveResponseTokenAsCookie, getApiFetchConfig, pushResponseErrorToState} from 'tetris-iso/utils'

function updateAdGroupCallOuts (campaign, adGroup, callOuts, config) {
  return PUT(`${process.env.ADPEEK_API_URL}/campaign/${campaign}/adGroup/${adGroup}/extension/call-outs`, assign({body: callOuts}, config))
}

export function updateAdGroupCallOutsAction (tree, {campaign, adGroup}, callOuts) {
  return updateAdGroupCallOuts(campaign, adGroup, callOuts, getApiFetchConfig(tree))
    .then(saveResponseTokenAsCookie)
    .catch(pushResponseErrorToState(tree))
}
