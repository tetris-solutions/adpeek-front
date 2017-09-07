import {PUT} from '@tetris/http'
import {saveResponseTokenAsCookie, getApiFetchConfig, pushResponseErrorToState} from '@tetris/front-server/utils'
import assign from 'lodash/assign'

function updateCampaignProximity (id, points, config) {
  return PUT(`${process.env.ADPEEK_API_URL}/campaign/${id}/criteria/proximity`, assign({body: points}, config))
}

export function updateCampaignProximityAction (tree, {company, workspace, folder, campaign}, points) {
  return updateCampaignProximity(campaign, points, getApiFetchConfig(tree))
    .then(saveResponseTokenAsCookie)
    .catch(pushResponseErrorToState(tree))
}
