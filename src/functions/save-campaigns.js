import {saveResponseData} from './save-response-data'
import {statusResolver} from './status-resolver'
import map from 'lodash/map'

export function saveCampaigns (tree, company, workspace, folder, name = 'campaigns') {
  const setStatus = statusResolver(tree.get('statuses'))

  function normalizeStatusAndAdSets (campaign) {
    campaign = setStatus(campaign)
    if (campaign.adsets) {
      campaign.adsets = map(campaign.adsets, setStatus)
    }
    return campaign
  }

  const transform = ls => map(ls, normalizeStatusAndAdSets)

  return saveResponseData(tree, [
    'user',
    ['companies', company],
    ['workspaces', workspace],
    ['folders', folder],
    name
  ], transform)
}
