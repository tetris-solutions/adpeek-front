import {PUT} from '@tetris/http'
import assign from 'lodash/assign'
import {saveResponseTokenAsCookie, getApiFetchConfig, pushResponseErrorToState} from 'tetris-iso/utils'
import {getDeepCursor} from '../functions/get-deep-cursor'
import forEach from 'lodash/forEach'
import map from 'lodash/map'

export function liveEditAdGroupAction (tree, {company, workspace, folder, campaign, adGroup}, changes) {
  const cursor = getDeepCursor(tree, [
    'user',
    ['companies', company],
    ['workspaces', workspace],
    ['folders', folder],
    ['campaigns', campaign],
    ['adGroups', adGroup]
  ])

  tree.merge(cursor, assign({lastUpdate: Date.now()}, changes))
  tree.commit()
}

export function removeAdAction (tree, {company, workspace, folder, campaign, adGroup, ad}) {
  const cursor = getDeepCursor(tree, [
    'user',
    ['companies', company],
    ['workspaces', workspace],
    ['folders', folder],
    ['campaigns', campaign],
    ['adGroups', adGroup],
    ['ads', ad]
  ])

  tree.unset(cursor)
  tree.commit()
}

export function removeKeywordAction (tree, {company, workspace, folder, campaign, adGroup, keyword}) {
  const cursor = getDeepCursor(tree, [
    'user',
    ['companies', company],
    ['workspaces', workspace],
    ['folders', folder],
    ['campaigns', campaign],
    ['adGroups', adGroup],
    ['keywords', keyword]
  ])

  tree.unset(cursor)
  tree.commit()
}

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

  const lastUpdate = assign({}, tree.get(cursor).lastUpdate)

  forEach(changes, (_, key) => {
    lastUpdate[key] = Date.now()
  })

  tree.merge(cursor, assign({lastUpdate}, changes))
  tree.commit()
}

export function liveEditKeywordAction (tree, {company, workspace, folder, campaign, adGroup, keyword}, changes) {
  const cursor = getDeepCursor(tree, [
    'user',
    ['companies', company],
    ['workspaces', workspace],
    ['folders', folder],
    ['campaigns', campaign],
    ['adGroups', adGroup],
    ['keywords', keyword]
  ])

  const lastUpdate = assign({}, tree.get(cursor).lastUpdate)

  forEach(changes, (_, key) => {
    lastUpdate[key] = Date.now()
  })

  tree.merge(cursor, assign({lastUpdate}, changes))
  tree.commit()
}

function updateCreatives (campaign, adGroups, config) {
  return PUT(`${process.env.ADPEEK_API_URL}/campaign/${campaign}/creatives`,
    assign({body: adGroups}, config))
}

const normalizeAdGroups = adGroups => map(adGroups,
  adGroup =>
    assign({}, adGroup, {
      keywords: map(adGroup.keywords,
        keyword => assign({}, keyword, {
          text: keyword.text
            .replace(/^["[]/g, '')
            .replace(/["\]]$/g, '')
        }))
    }))

export function updateCampaignCreativesAction (tree, {campaign}, adGroups) {
  return updateCreatives(campaign, normalizeAdGroups(adGroups), getApiFetchConfig(tree))
    .then(saveResponseTokenAsCookie)
    .catch(pushResponseErrorToState(tree))
}
