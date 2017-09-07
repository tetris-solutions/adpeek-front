import {PUT} from '@tetris/http'
import {saveResponseTokenAsCookie, getApiFetchConfig, pushResponseErrorToState} from '@tetris/front-server/utils'

function showFolder (folder, config) {
  return PUT(`${process.env.ADPEEK_API_URL}/folder/${folder}/show`, config)
}

export function showFolderAction (tree, {folder}) {
  return showFolder(folder, getApiFetchConfig(tree))
    .then(saveResponseTokenAsCookie)
    .catch(pushResponseErrorToState(tree))
}
