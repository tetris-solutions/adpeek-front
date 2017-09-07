import {PUT} from '@tetris/http'
import {saveResponseTokenAsCookie, getApiFetchConfig, pushResponseErrorToState} from '@tetris/front-server/utils'
import assign from 'lodash/assign'

function updateAccountTracking (folder, tracking, config) {
  return PUT(`${process.env.ADPEEK_API_URL}/folder/${folder}/tracking`, assign({body: tracking}, config))
}

export function updateAccountTrackingAction (tree, {folder}, tracking) {
  return updateAccountTracking(folder, tracking, getApiFetchConfig(tree))
    .then(saveResponseTokenAsCookie)
    .catch(pushResponseErrorToState(tree))
}
