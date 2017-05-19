import {PUT} from '@tetris/http'
import {saveResponseTokenAsCookie, getApiFetchConfig, pushResponseErrorToState} from 'tetris-iso/utils'
import assign from 'lodash/assign'

function updateCampaignLocation (id, locations, config) {
  return PUT(`${process.env.ADPEEK_API_URL}/campaign/${id}/criteria/location`, assign({body: locations}, config))
}

export function updateCampaignLocationAction (tree, {campaign}, locations) {
  return updateCampaignLocation(campaign, locations, getApiFetchConfig(tree))
    .then(saveResponseTokenAsCookie)
    .catch(pushResponseErrorToState(tree))
}
