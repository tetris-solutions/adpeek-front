import {PUT} from '@tetris/http'
import assign from 'lodash/assign'
import {saveResponseTokenAsCookie} from '@tetris/front-server/lib/functions/save-token-as-cookie'
import {getApiFetchConfig} from '@tetris/front-server/lib/functions/get-api-fetch-config'
import {pushResponseErrorToState} from '@tetris/front-server/lib/functions/push-response-error-to-state'
import {saveResponseData} from '../functions/save-response-data'

/**
 * sends a PUT request to the update workspace API
 * @param {Object} workspace updated workspace object
 * @param {Object} config request config object
 * @returns {Promise.<Object>} returns a promise that resolves to a object containing the new workspace id
 */
export function updateWorkspace (workspace, config) {
  return PUT(`${process.env.ADPEEK_API_URL}/workspace/${workspace.id}`, assign({body: workspace}, config))
}

/**
 * updates a given workspace
 * @param {Baobab} tree state tree
 * @param {String} company company id
 * @param {Object} workspace updated workspace object
 * @returns {Promise} resolves once the workspace is loaded
 */
export function updateWorkspaceAction (tree, company, workspace) {
  return updateWorkspace(workspace, getApiFetchConfig(tree))
    .then(saveResponseTokenAsCookie)
    .then(saveResponseData(tree, [
      'user',
      ['companies', company],
      ['workspaces', workspace.id]
    ]))
    .catch(pushResponseErrorToState(tree))
}

export default updateWorkspaceAction
