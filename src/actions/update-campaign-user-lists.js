import {PUT} from '@tetris/http'
import assign from 'lodash/assign'
import {saveResponseTokenAsCookie, getApiFetchConfig, pushResponseErrorToState} from 'tetris-iso/utils'

function updateCampaignUserLists (id, userLists, config) {
  return PUT(`${process.env.ADPEEK_API_URL}/campaign/${id}/criteria/user-list`, assign({body: userLists}, config))
}

export function updateCampaignUserListsAction (tree, {campaign}, userLists) {
  return updateCampaignUserLists(campaign, userLists, getApiFetchConfig(tree))
    .then(saveResponseTokenAsCookie)
    .catch(pushResponseErrorToState(tree))
}
