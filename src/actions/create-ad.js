import {getDeepCursor} from '../functions/get-deep-cursor'

export function pushAdAction (tree, {company, workspace, folder, campaign, adGroup}) {
  const adsCursor = tree.select(getDeepCursor(tree, [
    'user',
    ['companies', company],
    ['workspaces', workspace],
    ['folders', folder],
    ['campaigns', campaign],
    ['adGroups', adGroup],
    'ads'
  ]))

  // @todo support other ad types

  adsCursor.push({
    id: Math.random().toString(36).substr(2),
    draft: true,
    adgroup_id: adGroup,
    headline_part_1: '',
    headline_part_2: '',
    path_1: '',
    path_2: '',
    final_urls: [''],
    description: '',
    type: 'EXPANDED_TEXT_AD',
    status: 'ENABLED'
  })

  tree.commit()
  adsCursor.release()
}