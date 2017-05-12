import {GET} from '@tetris/http'
import {saveResponseTokenAsCookie, getApiFetchConfig} from 'tetris-iso/utils'
import {saveResponseData} from '../functions/save-response-data'

function loadCampaignOrder (campaign, config) {
  return GET(`${process.env.ADPEEK_API_URL}/campaign/${campaign}/order`, config)
}

export function loadCampaignOrderAction (tree, {company, workspace, folder, campaign}) {
  return loadCampaignOrder(campaign, getApiFetchConfig(tree))
    .then(saveResponseTokenAsCookie)
    .then(saveResponseData(tree, [
      'user',
      ['companies', company],
      ['workspaces', workspace],
      ['folders', folder],
      ['campaigns', campaign],
      'order'
    ]))
}
