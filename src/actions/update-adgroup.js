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
