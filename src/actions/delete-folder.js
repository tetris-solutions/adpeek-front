import {DELETE} from '@tetris/http'
import {saveResponseTokenAsCookie, getApiFetchConfig, pushResponseErrorToState} from 'tetris-iso/utils'
import {getDeepCursor} from '../functions/get-deep-cursor'

function deleteFolder (folder, config) {
  return DELETE(`${process.env.ADPEEK_API_URL}/folder/${folder}`, config)
}

export function deleteFolderAction (tree, {company, workspace}, folder) {
  return deleteFolder(folder, getApiFetchConfig(tree))
    .then(saveResponseTokenAsCookie)
    .then(r => {
      tree.unset(getDeepCursor(tree, [
        'user',
        ['companies', company],
        ['workspaces', workspace],
        ['folders', folder]
      ]))
      tree.commit()
      return r
    })
    .catch(pushResponseErrorToState(tree))
}
