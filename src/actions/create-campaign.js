import {POST} from '@tetris/http'
import assign from 'lodash/assign'
import {saveResponseTokenAsCookie, getApiFetchConfig, pushResponseErrorToState} from '@tetris/front-server/utils'

function createCampaign (folder, campaign, config) {
  return POST(`${process.env.ADPEEK_API_URL}/folder/${folder}/campaign`,
    assign({body: campaign}, config))
}

export function createCampaignAction (tree, {folder}, campaign) {
  return createCampaign(folder, campaign, getApiFetchConfig(tree))
    .then(saveResponseTokenAsCookie)
    .catch(pushResponseErrorToState(tree))
}
