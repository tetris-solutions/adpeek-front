import {GET} from '@tetris/http'
import {saveResponseTokenAsCookie, getApiFetchConfig, pushResponseErrorToState} from 'tetris-iso/utils'

function loadBundlePreviewUrl (folder, bundle, config) {
  return GET(`${process.env.ADPEEK_API_URL}/folder/${folder}/bundle/${bundle}`, config)
}

export function loadBundlePreviewUrlAction (tree, {folder}, id) {
  return loadBundlePreviewUrl(folder, id, getApiFetchConfig(tree))
    .then(saveResponseTokenAsCookie)
    .catch(pushResponseErrorToState(tree))
}
