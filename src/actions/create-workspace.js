import {POST} from '@tetris/http'
import assign from 'lodash/assign'
import {saveResponseTokenAsCookie, getApiFetchConfig, pushResponseErrorToState} from 'tetris-iso/utils'

/**
 * sends a POST request to the create workspace API
 * @param {String} company company id
 * @param {Object} workspace new workspace object
 * @param {Object} config request config object
 * @returns {Promise.<Object>} returns a promise that resolves to a object containing the new workspace id
 */
export function createWorkspace (company, workspace, config) {
  return POST(`${process.env.ADPEEK_API_URL}/company/${company}/workspace`, assign({body: workspace}, config))
}

/**
 * creates a new workspace
 * @param {Baobab} tree state tree
 * @param {String} company company id
 * @param {Object} workspace new workspace object
 * @returns {Promise} resolves once the workspace is loaded
 */
export function createWorkspaceAction (tree, company, workspace) {
  return createWorkspace(company, workspace, getApiFetchConfig(tree))
    .then(saveResponseTokenAsCookie)
    .catch(pushResponseErrorToState(tree))
}

export default createWorkspaceAction
