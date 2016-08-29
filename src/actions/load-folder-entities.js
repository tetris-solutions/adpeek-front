import {GET} from '@tetris/http'
import {saveResponseTokenAsCookie} from '@tetris/front-server/lib/functions/save-token-as-cookie'
import {getApiFetchConfig} from '@tetris/front-server/lib/functions/get-api-fetch-config'
import {pushResponseErrorToState} from '@tetris/front-server/lib/functions/push-response-error-to-state'
import {saveResponseData} from '../functions/save-response-data'
import assign from 'lodash/assign'

function loadFolderEntities (folder, config) {
  return GET(`${process.env.ADPEEK_API_URL}/folder/${folder}/entities`, config)
}

export function loadFolderEntitiesAction (tree, company, workspace, folder, token) {
  const mergeEntities = (entities, folder) => assign({}, folder, entities)

  return loadFolderEntities(folder, getApiFetchConfig(tree, token))
    .then(saveResponseTokenAsCookie)
    .then(saveResponseData(tree, [
      'user',
      ['companies', company],
      ['workspaces', workspace],
      ['folders', folder]
    ], mergeEntities))
    .catch(pushResponseErrorToState(tree))
}