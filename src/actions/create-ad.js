import {getDeepCursor} from '../functions/get-deep-cursor'

export function pushAdAction (tree, {company, workspace, folder, campaign, adGroup}, type) {
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

  const ad = {
    id: Math.random().toString(36).substr(2),
    draft: true,
    adgroup_id: adGroup,
    status: 'ENABLED',
    type
  }

  switch (type) {
    case 'EXPANDED_TEXT_AD':
      ad.headline_part_1 = ''
      ad.headline_part_2 = ''
      ad.path_1 = ''
      ad.path_2 = ''
      ad.final_urls = ['']
      ad.description = ''
      break

    case 'CALL_ONLY_AD':
      ad.country_code = ''
      ad.display_url = ''
      ad.call_ad_description_1 = ''
      ad.call_ad_description_2 = ''
      ad.phone_number = ''
      ad.business_name = tree.get(getDeepCursor(tree, [
        'user',
        ['companies', company],
        'name'
      ]))

      break

    case 'PRODUCT_AD':
      // since product ads lack any editable field, just flag it as touched already
      ad.lastUpdate = {status: Date.now()}

      break
  }

  adsCursor.push(ad)

  tree.commit()
  adsCursor.release()
}
