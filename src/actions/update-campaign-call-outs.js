import {PUT} from '@tetris/http'
import assign from 'lodash/assign'
import {saveResponseTokenAsCookie, getApiFetchConfig, pushResponseErrorToState} from 'tetris-iso/utils'

function updateCampaignCallOuts (id, callOuts, config) {
  return PUT(`${process.env.ADPEEK_API_URL}/campaign/${id}/extension/call-outs`, assign({body: callOuts}, config))
}

export function updateCampaignCallOutsAction (tree, {campaign}, callOuts) {
  return updateCampaignCallOuts(campaign, callOuts, getApiFetchConfig(tree))
    .then(saveResponseTokenAsCookie)
    .catch(pushResponseErrorToState(tree))
}
