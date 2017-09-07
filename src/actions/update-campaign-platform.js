import {PUT} from '@tetris/http'
import {saveResponseTokenAsCookie, getApiFetchConfig, pushResponseErrorToState} from '@tetris/front-server/utils'
import assign from 'lodash/assign'

function updateCampaignPlatform (id, platforms, config) {
  return PUT(`${process.env.ADPEEK_API_URL}/campaign/${id}/criteria/platform`, assign({body: platforms}, config))
}

export function updateCampaignPlatformAction (tree, {campaign}, platforms) {
  return updateCampaignPlatform(campaign, platforms, getApiFetchConfig(tree))
    .then(saveResponseTokenAsCookie)
    .catch(pushResponseErrorToState(tree))
}
