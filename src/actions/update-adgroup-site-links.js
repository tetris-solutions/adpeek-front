import {PUT} from '@tetris/http'
import assign from 'lodash/assign'
import {saveResponseTokenAsCookie, getApiFetchConfig, pushResponseErrorToState} from '@tetris/front-server/utils'

function updateAdGroupSiteLinks (campaign, adGroup, siteLinks, config) {
  return PUT(`${process.env.ADPEEK_API_URL}/campaign/${campaign}/adGroup/${adGroup}/extension/site-links`, assign({body: siteLinks}, config))
}

export function updateAdGroupSiteLinksAction (tree, {campaign, adGroup}, siteLinks) {
  return updateAdGroupSiteLinks(campaign, adGroup, siteLinks, getApiFetchConfig(tree))
    .then(saveResponseTokenAsCookie)
    .catch(pushResponseErrorToState(tree))
}
