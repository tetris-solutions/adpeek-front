import {getDeepCursor} from '../functions/get-deep-cursor'
import forEach from 'lodash/forEach'
import {randomString} from '../functions/random-string'

export function pushKeywordsAction (tree, {company, workspace, folder, campaign, adGroup}, criterionUse, keywords) {
  const keywordsCursor = tree.select(getDeepCursor(tree, [
    'user',
    ['companies', company],
    ['workspaces', workspace],
    ['folders', folder],
    ['campaigns', campaign],
    ['adGroups', adGroup],
    'keywords'
  ]))

  forEach(keywords, ({text, match_type}) =>
    keywordsCursor.push({
      draft: true,
      adgroup_id: adGroup,
      approval_status: 'APPROVED',
      criterion_use: criterionUse,
      lastUpdate: {
        status: Date.now(),
        text: Date.now()
      },
      final_urls: null,
      id: randomString(),
      status: 'ENABLED',
      match_type,
      text
    }))

  tree.commit()
  keywordsCursor.release()
}
