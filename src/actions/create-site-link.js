import {POST} from '@tetris/http'
import {saveResponseTokenAsCookie, getApiFetchConfig, pushResponseErrorToState} from '@tetris/front-server/utils'
import assign from 'lodash/assign'
import {saveResponseData} from '../functions/save-response-data'
import concat from 'lodash/concat'

function createSiteLinkExtension (folder, feed, siteLink, config) {
  return POST(`${process.env.ADPEEK_API_URL}/folder/${folder}/feed/${feed}/extension/site-link`, assign({body: siteLink}, config))
}

const push = (newSiteLink, ls) => concat(ls, newSiteLink)

export function createSiteLinkExtensionAction (tree, {company, workspace, folder}, feedId, siteLink) {
  return createSiteLinkExtension(folder, feedId, siteLink, getApiFetchConfig(tree))
    .then(saveResponseTokenAsCookie)
    .then(saveResponseData(tree, [
      'user',
      ['companies', company],
      ['workspaces', workspace],
      ['folders', folder],
      'siteLinks'
    ], push))
    .catch(pushResponseErrorToState(tree))
}
