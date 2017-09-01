import {POST} from '@tetris/http'
import assign from 'lodash/assign'
import {saveResponseTokenAsCookie, getApiFetchConfig, pushResponseErrorToState} from 'tetris-iso/utils'

function getAliases (ids, config) {
  return POST(`${process.env.ADPEEK_API_URL}/aliases`,
    assign({body: ids}, config))
}

/**
 *
 * @param {Baobab} tree state tree
 * @param {Array} ids uuids to alias
 * @param {String} [token] optional token
 * @return {Promise.<Object>} map of aliases
 */
export function getAliasesAction (tree, ids, token) {
  return getAliases(ids, getApiFetchConfig(tree, token))
    .then(saveResponseTokenAsCookie)
    .catch(pushResponseErrorToState(tree))
}
