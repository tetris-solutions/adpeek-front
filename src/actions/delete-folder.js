import {DELETE} from '@tetris/http'
import {saveResponseTokenAsCookie, getApiFetchConfig, pushResponseErrorToState} from 'tetris-iso/utils'

export function deleteFolder (folder, config) {
  return DELETE(`${process.env.ADPEEK_API_URL}/folder/${folder}`, config)
}

export function deleteFolderAction (tree, folder) {
  return deleteFolder(folder, getApiFetchConfig(tree))
    .then(saveResponseTokenAsCookie)
    .catch(pushResponseErrorToState(tree))
}

export default deleteFolderAction
