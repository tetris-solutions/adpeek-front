import {getDeepCursor} from './get-deep-cursor'
import {mergeResponseArray} from './merge-response-arrays'
import assign from 'lodash/assign'
/**
 * computes dynamic tree cursor and sets fetch response there
 * @param {Baobab} tree state tree
 * @param {Array} path cursor clue
 * @param {Function} [transform=identity] transform function
 * @returns {Function} resolve handler
 */
export function saveResponseData (tree, path, transform = mergeResponseArray) {
  /**
   * resolve handler
   * @param {Response} response response object
   * @returns {Response} passes the same response ahead
   */
  function onFulfilled (response) {
    const cursor = getDeepCursor(tree, path)

    tree.set(cursor, transform(response.data, tree.get(cursor)))
    tree.commit()

    return response
  }

  return onFulfilled
}

export const mergeResponseData = (tree, path) =>
  saveResponseData(tree, path, (updates, old) => assign({}, old, updates))
