import isArray from 'lodash/isArray'
import findIndex from 'lodash/findIndex'
import forEach from 'lodash/forEach'
import size from 'lodash/size'

/**
 * transforms dynamic cursor in a working one
 * @param {Baobab} tree state tree
 * @param {Array} path path array
 * @returns {Array} the normalized cursor
 */
export function getDeepCursor (tree, path) {
  const cursor = []

  function dive (pointer) {
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
    }

    const index = findIndex(data, {[idField]: id})

    cursor.push(index >= 0 ? index : size(data))
  }

  forEach(path, dive)

  return cursor
}
