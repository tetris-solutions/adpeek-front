import findIndex from 'lodash/findIndex'
import isArray from 'lodash/isArray'
import identity from 'lodash/identity'

/**
 * computes dynamic tree cursor and sets fetch response there
 * @param {Baobab} tree state tree
 * @param {Array} path cursor clue
 * @param {Function} [transform=identity] transform function
 * @returns {Function} resolve handler
 */
export function saveResponseData (tree, path, transform = identity) {
  /**
   * resolve handler
   * @param {Response} response response object
   * @returns {Response} passes the same response ahead
   */
  function onFulfilled (response) {
    const cursor = []

    function dive (name) {
      let id

      if (isArray(name)) {
        id = name[1]
        name = name[0]
      }

      cursor.push(name)

      if (!id) return

      if (!tree.get(cursor)) {
        tree.set(cursor, [])
      }

      const index = findIndex(tree.get(cursor), {id})

      cursor.push(index >= 0 ? index : 0)
    }

    path.forEach(dive)

    tree.set(cursor, transform(response.data, tree.get(cursor)))
    tree.commit()

    return response
  }

  return onFulfilled
}
