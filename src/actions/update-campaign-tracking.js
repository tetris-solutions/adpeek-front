import {PUT} from '@tetris/http'
import {saveResponseTokenAsCookie, getApiFetchConfig, pushResponseErrorToState} from 'tetris-iso/utils'
import assign from 'lodash/assign'

function updateCampaignTracking (id, tracking, config) {
  return PUT(`${process.env.ADPEEK_API_URL}/campaign/${id}/tracking`, assign({body: tracking}, config))
}

export function updateCampaignTrackingAction (tree, {campaign}, tracking) {
  return updateCampaignTracking(campaign, tracking, getApiFetchConfig(tree))
    .then(saveResponseTokenAsCookie)
    .catch(pushResponseErrorToState(tree))
}
