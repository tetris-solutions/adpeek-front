import {getDeepCursor} from '../functions/get-deep-cursor'
import forEach from 'lodash/forEach'

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
      final_urls: null,
      id: Math.random().toString(36).substr(2),
      status: 'ENABLED',
      match_type,
      text
    }))

  tree.commit()
  keywordsCursor.release()
}
