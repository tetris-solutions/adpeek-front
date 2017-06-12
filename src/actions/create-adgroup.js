import {getDeepCursor} from '../functions/get-deep-cursor'

export function pushAdGroupAction (tree, {company, workspace, folder, campaign}) {
  const cursor = tree.select(getDeepCursor(tree, [
    'user',
    ['companies', company],
    ['workspaces', workspace],
    ['folders', folder],
    ['campaigns', campaign]
  ]))

  const {name, id} = cursor.get()

  cursor.push('adGroups', {
    id: Math.random().toString(36).substr(2),
    draft: true,
    campaign_id: id,
    campaign_name: name,
    name: tree.get(['intl', 'messages', 'newAdGroup']),
    keywords: [],
    ads: [],
    status: 'ENABLED'
  })

  cursor.set('_update_', Date.now())

  tree.commit()
  cursor.release()
}