import {POST} from '@tetris/http'
import {saveResponseTokenAsCookie, getApiFetchConfig, pushResponseErrorToState} from 'tetris-iso/utils'
import assign from 'lodash/assign'

function createSiteLinkExtension (campaign, siteLink, config) {
  return POST(`${process.env.ADPEEK_API_URL}/folder/${campaign}/extension/site-link`, assign({body: siteLink}, config))
}

export function createSiteLinkExtensionAction (tree, {campaign}, siteLink) {
  return createSiteLinkExtension(campaign, siteLink, getApiFetchConfig(tree))
    .then(saveResponseTokenAsCookie)
    .catch(pushResponseErrorToState(tree))
}
