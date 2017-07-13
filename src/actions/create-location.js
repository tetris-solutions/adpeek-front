import {POST} from '@tetris/http'
import {saveResponseTokenAsCookie, getApiFetchConfig, pushResponseErrorToState} from 'tetris-iso/utils'
import assign from 'lodash/assign'
import {saveResponseData} from '../functions/save-response-data'
import concat from 'lodash/concat'

function createLocationFeedItem (folder, feed, location, config) {
  return POST(`${process.env.ADPEEK_API_URL}/folder/${folder}/feed/${feed}/location`, assign({body: location}, config))
}

const push = (newLocation, ls) => concat(ls, newLocation)

export function createLocationFeedItemAction (tree, {company, workspace, folder, campaign}, feedId, location) {
  return createLocationFeedItem(folder, feedId, location, getApiFetchConfig(tree))
    .then(saveResponseTokenAsCookie)
    .then(saveResponseData(tree, [
      'user',
      ['companies', company],
      ['workspaces', workspace],
      ['folders', folder],
      ['campaign', campaign],
      'details',
      'locations'
    ], push))
    .catch(pushResponseErrorToState(tree))
}
