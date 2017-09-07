import {PUT} from '@tetris/http'
import {saveResponseTokenAsCookie, getApiFetchConfig, pushResponseErrorToState} from '@tetris/front-server/utils'

function hideFolder (folder, config) {
  return PUT(`${process.env.ADPEEK_API_URL}/folder/${folder}/hide`, config)
}

export function hideFolderAction (tree, {folder}) {
  return hideFolder(folder, getApiFetchConfig(tree))
    .then(saveResponseTokenAsCookie)
    .catch(pushResponseErrorToState(tree))
}
