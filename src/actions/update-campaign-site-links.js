import {PUT} from '@tetris/http'
import assign from 'lodash/assign'
import {saveResponseTokenAsCookie, getApiFetchConfig, pushResponseErrorToState} from '@tetris/front-server/utils'

function updateCampaignSiteLinks (id, siteLinks, config) {
  return PUT(`${process.env.ADPEEK_API_URL}/campaign/${id}/extension/site-links`, assign({body: siteLinks}, config))
}

export function updateCampaignSiteLinksAction (tree, {campaign}, siteLinks) {
  return updateCampaignSiteLinks(campaign, siteLinks, getApiFetchConfig(tree))
    .then(saveResponseTokenAsCookie)
    .catch(pushResponseErrorToState(tree))
}
