import {POST} from '@tetris/http'
import assign from 'lodash/assign'
import {saveResponseTokenAsCookie} from '@tetris/front-server/lib/functions/save-token-as-cookie'
import {getApiFetchConfig} from '@tetris/front-server/lib/functions/get-api-fetch-config'
import {pushResponseErrorToState} from '@tetris/front-server/lib/functions/push-response-error-to-state'

/**
 * sends a POST request to the create folder API
 * @param {String} company company id
 * @param {String} workspace workspace id
 * @param {String} name folder name
 * @param {Object} config request config object
 * @returns {Promise.<Object>} returns a promise that resolves to a object containing the new folder id
 */
export function createFolder (company, workspace, name, config) {
  return POST(`${process.env.ADPEEK_API_URL}/company/${company}/workspace/${workspace}/folder`, assign({body: {name}}, config))
}

/**
 * creates a new folder
 * @param {Baobab} tree state tree
 * @param {String} company company id
 * @param {String} workspace workspace id
 * @param {String} name folder name
 * @returns {Promise} resolves once the workspace is loaded
 */
export function createFolderAction (tree, company, workspace, name) {
  return createFolder(company, workspace, name, getApiFetchConfig(tree))
    .then(saveResponseTokenAsCookie)
    .catch(pushResponseErrorToState(tree))
}

export default createFolderAction
