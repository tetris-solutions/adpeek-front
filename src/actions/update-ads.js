import assign from 'lodash/assign'
import {getDeepCursor} from '../functions/get-deep-cursor'

export function liveEditAdAction (tree, {company, workspace, folder, campaign, adGroup, ad}, changes) {
  const cursor = getDeepCursor(tree, [
    'user',
    ['companies', company],
    ['workspaces', workspace],
    ['folders', folder],
    ['campaigns', campaign],
    ['adGroups', adGroup],
    ['ads', ad]
  ])

  tree.merge(cursor, assign({lastUpdate: Date.now()}, changes))
  tree.commit()
}
