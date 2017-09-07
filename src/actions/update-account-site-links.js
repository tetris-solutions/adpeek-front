import {PUT} from '@tetris/http'
import assign from 'lodash/assign'
import {saveResponseTokenAsCookie, getApiFetchConfig, pushResponseErrorToState} from '@tetris/front-server/utils'

function updateAccountSiteLinks (folder, siteLinks, config) {
  return PUT(`${process.env.ADPEEK_API_URL}/folder/${folder}/extension/site-links`, assign({body: siteLinks}, config))
}

export function updateAccountSiteLinksAction (tree, {folder}, siteLinks) {
  return updateAccountSiteLinks(folder, siteLinks, getApiFetchConfig(tree))
    .then(saveResponseTokenAsCookie)
    .catch(pushResponseErrorToState(tree))
}
