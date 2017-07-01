import {GET} from '@tetris/http'
import {saveResponseTokenAsCookie, getApiFetchConfig, pushResponseErrorToState} from 'tetris-iso/utils'
import {mergeResponseData} from '../functions/save-response-data'

function loadCampaignShoppingSetup (campaign, config) {
  return GET(`${process.env.ADPEEK_API_URL}/campaign/${campaign}/shopping-setup`, config)
}

export function loadCampaignShoppingSetupAction (tree, {company, workspace, folder, campaign}) {
  return loadCampaignShoppingSetup(campaign, getApiFetchConfig(tree))
    .then(saveResponseTokenAsCookie)
    .then(mergeResponseData(tree, [
      'user',
      ['companies', company],
      ['workspaces', workspace],
      ['folders', folder],
      ['campaigns', campaign]
    ]))
    .catch(pushResponseErrorToState(tree))
}
