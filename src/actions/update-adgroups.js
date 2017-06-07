import {PUT} from '@tetris/http'
import assign from 'lodash/assign'
import {saveResponseTokenAsCookie, getApiFetchConfig, pushResponseErrorToState} from 'tetris-iso/utils'
import {getDeepCursor} from '../functions/get-deep-cursor'

export function liveEditAdGroupAction (tree, {company, workspace, folder, campaign, adGroup}, changes) {
  tree.merge(getDeepCursor(tree, [
    'user',
    ['companies', company],
    ['workspaces', workspace],
    ['folders', folder],
    ['campaigns', campaign],
    ['adGroups', adGroup]
  ]), changes)

  tree.commit()
}

function updateAdGroups (campaign, adGroups, config) {
  return PUT(`${process.env.ADPEEK_API_URL}/campaign/${campaign}/adGroups`,
    assign({body: adGroups}, config))
}

export function updateAdGroupsAction (tree, {campaign}, adGroups) {
  return updateAdGroups(campaign, adGroups, getApiFetchConfig(tree))
    .then(saveResponseTokenAsCookie)
    .catch(pushResponseErrorToState(tree))
}
