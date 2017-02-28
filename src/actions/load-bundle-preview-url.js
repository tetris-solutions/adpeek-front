import {GET} from '@tetris/http'
import {saveResponseTokenAsCookie, getApiFetchConfig, pushResponseErrorToState} from 'tetris-iso/utils'

function loadBundlePreviewUrl (folder, bundle, config) {
  return GET(`${process.env.ADPEEK_API_URL}/folder/${folder}/bundle/${bundle}`, config)
}

const register = {}

export function loadBundlePreviewUrlAction (tree, {folder}, id) {
  register[id] = register[id] || loadBundlePreviewUrl(folder, id, getApiFetchConfig(tree))
      .then(saveResponseTokenAsCookie)
      .catch(pushResponseErrorToState(tree))

  return register[id]
}
