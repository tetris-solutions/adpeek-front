import {PUT} from '@tetris/http'
import assign from 'lodash/assign'
import {saveResponseTokenAsCookie, getApiFetchConfig, pushResponseErrorToState} from 'tetris-iso/utils'

function updateCampaignDynamicSearchAds (id, dsa, config) {
  return PUT(`${process.env.ADPEEK_API_URL}/campaign/${id}/settings/dynamic-search-ads`, assign({body: dsa}, config))
}

export function updateCampaignDynamicSearchAdsAction (tree, {company, workspace, folder, campaign}, dsa) {
  return updateCampaignDynamicSearchAds(campaign, dsa, getApiFetchConfig(tree))
    .then(saveResponseTokenAsCookie)
    .catch(pushResponseErrorToState(tree))
}

