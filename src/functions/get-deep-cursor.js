import isArray from 'lodash/isArray'
import findIndex from 'lodash/findIndex'
import forEach from 'lodash/forEach'
import size from 'lodash/size'
import loglevel from 'loglevel'
import {randomString} from './random-string'

/**
 * transforms dynamic cursor in a working one
 * @param {Baobab} tree state tree
 * @param {Array} path path array
 * @returns {Array} the normalized cursor
 */
export function getDeepCursor (tree, path) {
  const cursor = []

  function dive (pointer, index) {
    let id, name
    let idField = 'id'

    if (isArray(pointer)) {
      name = pointer[0]
      id = pointer[1]
      idField = pointer[2] !== undefined
        ? pointer[2]
        : idField
    } else {
      name = pointer
    }

    cursor.push(name)

    if (!id) return

    const data = tree.get(cursor)

    if (!data) {
      tree.set(cursor, [])
      tree.commit()
    }

    const innerIndex = findIndex(data, {[idField]: id})

    if (innerIndex === -1 && index < path.length - 1) {
      // data returned would be placed in a leaf (of the state tree) whose parent node does not exist
      throw new Error('The system has failed')
    }

    cursor.push(innerIndex >= 0 ? innerIndex : size(data))
  }

  try {
    forEach(path, dive)
    return cursor
  } catch (e) {
    loglevel.error(e)
    // @todo find a better way to deal with data returned from the api but that don't fit the state tree
    return ['lostAndFound', randomString()]
  }
}
