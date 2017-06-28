import {PUT} from '@tetris/http'
import assign from 'lodash/assign'
import {saveResponseTokenAsCookie, getApiFetchConfig, pushResponseErrorToState} from 'tetris-iso/utils'

function updateAdGroupUserLists (campaign, adGroup, userLists, config) {
  return PUT(`${process.env.ADPEEK_API_URL}/campaign/${campaign}/adgroup/${adGroup}/criteria/user-list`,
    assign({body: userLists}, config))
}

export function updateAdGroupUserListsAction (tree, {campaign, adGroup}, userLists) {
  return updateAdGroupUserLists(campaign, adGroup, userLists, getApiFetchConfig(tree))
    .then(saveResponseTokenAsCookie)
    .catch(pushResponseErrorToState(tree))
}

