import {getDeepCursor} from '../functions/get-deep-cursor'

export function pushKeyworddAction (tree, {company, workspace, folder, campaign, adGroup}, criterionUse) {
  const keywordsCursor = tree.select(getDeepCursor(tree, [
    'user',
    ['companies', company],
    ['workspaces', workspace],
    ['folders', folder],
    ['campaigns', campaign],
    ['adGroups', adGroup],
    'keywords'
  ]))

  const keyword = {
    draft: true,
    adgroup_id: adGroup,
    approval_status: 'APPROVED',
    criterion_use: criterionUse,
    destination_url: null,
    final_urls: null,
    id: Math.random().toString(36).substr(2),
    match_type: 'BROAD',
    text: ''
  }

  if (criterionUse === 'BIDDABLE') {
    keyword.status = 'ENABLED'
  }

  keywordsCursor.push(keyword)

  tree.commit()
  keywordsCursor.release()
}