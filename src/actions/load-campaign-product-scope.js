import {GET} from '@tetris/http'
import {saveResponseTokenAsCookie, getApiFetchConfig, pushResponseErrorToState} from 'tetris-iso/utils'
import {saveResponseData} from '../functions/save-response-data'

function loadCampaignProductScope (campaign, fresh, config) {
  return GET(`${process.env.ADPEEK_API_URL}/campaign/${campaign}/product-scope${fresh ? '?fresh=true' : ''}`, config)
}

export function loadCampaignProductScopeAction (tree, {company, workspace, folder, campaign}, fresh = false) {
  return loadCampaignProductScope(campaign, fresh, getApiFetchConfig(tree))
    .then(saveResponseTokenAsCookie)
    .then(saveResponseData(tree, [
      'user',
      ['companies', company],
      ['workspaces', workspace],
      ['folders', folder],
      ['campaigns', campaign],
      'productScope'
    ]))
    .catch(pushResponseErrorToState(tree))
}
