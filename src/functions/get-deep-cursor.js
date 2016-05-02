import isArray from 'lodash/isArray'
import findIndex from 'lodash/findIndex'

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

    if (!tree.get(cursor)) {
      tree.set(cursor, [])
    }

    const index = findIndex(tree.get(cursor), {[idField]: id})

    cursor.push(index >= 0 ? index : 0)
  }

  path.forEach(dive)

  return cursor
}
