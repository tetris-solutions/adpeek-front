import {PUT} from '@tetris/http'
import assign from 'lodash/assign'
import {saveResponseTokenAsCookie} from '@tetris/front-server/lib/functions/save-token-as-cookie'
import {getApiFetchConfig} from '@tetris/front-server/lib/functions/get-api-fetch-config'
import {pushResponseErrorToState} from '@tetris/front-server/lib/functions/push-response-error-to-state'
import {saveResponseData} from '../functions/save-response-data'

/**
 * sends a PUT request to the update folder API
 * @param {Object} folder folder object
 * @param {Object} config request config object
 * @returns {Promise.<Object>} returns a promise that resolves to a object containing the new folder id
 */
export function updateFolder (folder, config) {
  return PUT(`${process.env.ADPEEK_API_URL}/folder/${folder.id}`,
    assign({body: folder}, config))
}

/**
 * updates given folder
 * @param {Baobab} tree state tree
 * @param {String} company company id
 * @param {String} workspace workspace id
 * @param {Object} folder folder object
 * @returns {Promise} resolves once the workspace is loaded
 */
export function updateFolderAction (tree, company, workspace, folder) {
  return updateFolder(folder, getApiFetchConfig(tree))
    .then(saveResponseTokenAsCookie)
    .then(saveResponseData(tree, [
      'user',
      ['companies', company],
      ['workspaces', workspace],
      ['folders', folder]
    ]))
    .catch(pushResponseErrorToState(tree))
}

export default updateFolderAction
