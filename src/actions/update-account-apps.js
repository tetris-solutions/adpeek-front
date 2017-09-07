import {PUT} from '@tetris/http'
import assign from 'lodash/assign'
import {saveResponseTokenAsCookie, getApiFetchConfig, pushResponseErrorToState} from '@tetris/front-server/utils'

function updateAccountApps (folder, apps, config) {
  return PUT(`${process.env.ADPEEK_API_URL}/folder/${folder}/extension/apps`, assign({body: apps}, config))
}

export function updateAccountAppsAction (tree, {folder}, apps) {
  return updateAccountApps(folder, apps, getApiFetchConfig(tree))
    .then(saveResponseTokenAsCookie)
    .catch(pushResponseErrorToState(tree))
}
