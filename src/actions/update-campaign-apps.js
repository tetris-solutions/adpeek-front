import {PUT} from '@tetris/http'
import assign from 'lodash/assign'
import {saveResponseTokenAsCookie, getApiFetchConfig, pushResponseErrorToState} from 'tetris-iso/utils'

function updateCampaignApps (id, apps, config) {
  return PUT(`${process.env.ADPEEK_API_URL}/campaign/${id}/extension/apps`, assign({body: apps}, config))
}

export function updateCampaignAppsAction (tree, {campaign}, apps) {
  return updateCampaignApps(campaign, apps, getApiFetchConfig(tree))
    .then(saveResponseTokenAsCookie)
    .catch(pushResponseErrorToState(tree))
}
