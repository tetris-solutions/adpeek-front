import {getDeepCursor} from './get-deep-cursor'
import {mergeResponseArray} from './merge-response-arrays'
import assign from 'lodash/assign'
import map from 'lodash/map'
import find from 'lodash/find'

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

const mergeObject = (updates, old) => assign({}, old, updates)

export const mergeResponseData = (tree, path) => saveResponseData(tree, path, mergeObject)

const mergeArrayById = (newList, oldList) =>
  map(newList, item => assign({},
    find(oldList, {id: item.id}),
    item))

export const mergeList = (tree, path) => saveResponseData(tree, path, mergeArrayById)
