import {getDeepCursor} from '../functions/get-deep-cursor'
import {randomString} from '../functions/random-string'

export function pushAdGroupAction (tree, {company, workspace, folder, campaign}) {
  const campaignCursor = tree.select(getDeepCursor(tree, [
    'user',
    ['companies', company],
    ['workspaces', workspace],
    ['folders', folder],
    ['campaigns', campaign]
  ]))

  const {name, id} = campaignCursor.get()

  campaignCursor.push('adGroups', {
    id: randomString(),
    draft: true,
    campaign_id: id,
    campaign_name: name,
    name: tree.get(['intl', 'messages', 'newAdGroup']),
    keywords: [],
    ads: [],
    status: 'ENABLED',
    lastUpdate: Date.now()
  })

  campaignCursor.set('_update_', Date.now())

  tree.commit()
  campaignCursor.release()
}
