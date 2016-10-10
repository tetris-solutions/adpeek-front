import {POST} from '@tetris/http'
import assign from 'lodash/assign'
import {saveResponseTokenAsCookie, getApiFetchConfig, pushResponseErrorToState} from 'tetris-iso/utils'

/**
 * sends a POST request to the create folder API
 * @param {String} workspace workspace id
 * @param {Object} folder folder object
 * @param {Object} config request config object
 * @returns {Promise.<Object>} returns a promise that resolves to a object containing the new folder id
 */
export function createFolder (workspace, folder, config) {
  return POST(`${process.env.ADPEEK_API_URL}/workspace/${workspace}/folder`,
    assign({body: folder}, config))
}

/**
 * creates a new folder
 * @param {Baobab} tree state tree
 * @param {String} workspace workspace id
 * @param {Object} folder folder object
 * @returns {Promise} resolves once the workspace is loaded
 */
export function createFolderAction (tree, workspace, folder) {
  return createFolder(workspace, folder, getApiFetchConfig(tree))
    .then(saveResponseTokenAsCookie)
    .catch(pushResponseErrorToState(tree))
}

export default createFolderAction
