import {PUT} from '@tetris/http'
import assign from 'lodash/assign'
import {saveResponseTokenAsCookie, getApiFetchConfig, pushResponseErrorToState} from '@tetris/front-server/utils'
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

const mergeUpdatedFolder = (newFolder, oldFolder) => assign({}, oldFolder, newFolder)

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
      ['folders', folder.id]
    ], mergeUpdatedFolder))
    .catch(pushResponseErrorToState(tree))
}
