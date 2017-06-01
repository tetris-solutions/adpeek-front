import {POST} from '@tetris/http'
import {saveResponseTokenAsCookie, getApiFetchConfig, pushResponseErrorToState} from 'tetris-iso/utils'
import assign from 'lodash/assign'
import {saveResponseData} from '../functions/save-response-data'
import concat from 'lodash/concat'

function createAppExtension (folder, feed, app, config) {
  return POST(`${process.env.ADPEEK_API_URL}/folder/${folder}/feed/${feed}/extension/app`, assign({body: app}, config))
}

const push = (newApp, ls) => concat(ls, newApp)

export function createAppExtensionAction (tree, {company, workspace, folder}, feedId, app) {
  return createAppExtension(folder, feedId, app, getApiFetchConfig(tree))
    .then(saveResponseTokenAsCookie)
    .then(saveResponseData(tree, [
      'user',
      ['companies', company],
      ['workspaces', workspace],
      ['folders', folder],
      'apps'
    ], push))
    .catch(pushResponseErrorToState(tree))
}
