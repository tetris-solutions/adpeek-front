import {PUT} from '@tetris/http'
import {saveResponseTokenAsCookie, getApiFetchConfig, pushResponseErrorToState} from 'tetris-iso/utils'
import assign from 'lodash/assign'

function updateAdGroupPlatform (campaign, adGroup, platforms, config) {
  return PUT(`${process.env.ADPEEK_API_URL}/campaign/${campaign}/adgroup/${adGroup}/criteria/platform`,
    assign({body: platforms}, config))
}

export function updateAdGroupPlatformAction (tree, {campaign, adGroup}, platforms) {
  return updateAdGroupPlatform(campaign, adGroup, platforms, getApiFetchConfig(tree))
    .then(saveResponseTokenAsCookie)
    .catch(pushResponseErrorToState(tree))
}