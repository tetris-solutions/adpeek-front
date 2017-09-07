import {GET} from '@tetris/http'
import {saveResponseTokenAsCookie, getApiFetchConfig, pushResponseErrorToState} from '@tetris/front-server/utils'
import {saveResponseData} from '../functions/save-response-data'

function loadCampaignBiddingStrategy (campaign, config) {
  return GET(`${process.env.ADPEEK_API_URL}/campaign/${campaign}/bidding-strategy`, config)
}

export function loadCampaignBiddingStrategyAction (tree, {company, workspace, folder, campaign}) {
  return loadCampaignBiddingStrategy(campaign, getApiFetchConfig(tree))
    .then(saveResponseTokenAsCookie)
    .then(saveResponseData(tree, [
      'user',
      ['companies', company],
      ['workspaces', workspace],
      ['folders', folder],
      ['campaigns', campaign],
      'biddingStrategy'
    ]))
    .catch(pushResponseErrorToState(tree))
}
