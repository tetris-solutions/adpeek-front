import {GET} from '@tetris/http'
import {saveResponseTokenAsCookie, getApiFetchConfig, pushResponseErrorToState} from 'tetris-iso/utils'
import {saveResponseData} from '../functions/save-response-data'

function loadCampaignDetails (campaign, config) {
  return GET(`${process.env.ADPEEK_API_URL}/campaign/${campaign}/details`, config)
}

export function loadCampaignDetailsAction (tree, {company, workspace, folder, campaign}) {
  return loadCampaignDetails(campaign, getApiFetchConfig(tree))
    .then(saveResponseTokenAsCookie)
    .then(saveResponseData(tree, [
      'user',
      ['companies', company],
      ['workspaces', workspace],
      ['folders', folder],
      ['campaigns', campaign],
      'details'
    ]))
    .catch(pushResponseErrorToState(tree))
}
