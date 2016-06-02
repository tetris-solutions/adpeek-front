import React from 'react'
import forEach from 'lodash/forEach'
import findIndex from 'lodash/findIndex'
import {branch} from 'baobab-react/dist-modules/higher-order'
import isObject from 'lodash/isObject'
import assign from 'lodash/assign'
import keys from 'lodash/keys'

const {PropTypes} = React
const isRouteParam = {
  company: true,
  workspace: true,
  folder: true,
  order: true
}
const searchPath = {
  company: [['company', 'companies']]
}

searchPath.workspace = searchPath.company.concat([['workspace', 'workspaces']])
searchPath.folder = searchPath.workspace.concat([['folder', 'folders']])
searchPath.order = searchPath.folder.concat([['order', 'orders']])

/**
 * nope
 * @param {String} entity entity to search for
 * @param {Object} tree object to dive into
 * @param {Object} params route params
 * @param {Array} [cursor] tree cursor array
 * @param {Array} [path=null] search path
 * @returns {Array|null} the full path to the object
 */
function getCursorToEntity (entity, tree, params, cursor = [], path = null) {
  path = path || searchPath[entity].concat()

  const top = path.shift()

  if (!top) return null

  const [name, list] = top

  if (!params[name]) return null

  const index = findIndex(tree[list], {id: params[name]})

  if (index < 0) {
    return null
  }

  cursor.push(list)
  cursor.push(index)

  if (name === entity) {
    return cursor
  }

  return getCursorToEntity(entity, tree[list][index], params, cursor, path)
}

/**
 * HOC that injects route/context dependent properties in a component
 * @param {Function} Component component to extend
 * @param {Object|String} baseCursors cursors that will be passed directly into baobab-react's branch function
 * @param {...String} names context dependent properties names
 * @return {Function} the extended react component
 */
export function contextualize (Component, baseCursors, ...names) {
  const cached = {}

  if (!isObject(baseCursors)) {
    names.unshift(baseCursors)
    baseCursors = {}
  }

  function PropsInjector (props) {
    forEach(names, name => {
      if (isRouteParam[name] && !props[name] && !props.params[name]) {
        cached[name] = null
      } else {
        cached[name] = props[name] || cached[name]
      }
    })

    return <Component {...props} {...cached} />
  }
  const propsNames = keys(baseCursors).concat(names).join(', ')

  const injectParams = Child => {
    const ParamsInjector = (props, {params}) => <Child {...props} params={params}/>

    ParamsInjector.displayName = `Contextualize(${Component.displayName}, ${propsNames})`
    ParamsInjector.contextTypes = {
      params: PropTypes.object
    }

    return ParamsInjector
  }

  PropsInjector.displayName = 'Props-Injector'
  PropsInjector.propTypes = {}

  const paramsShape = {}

  forEach(names, name => {
    PropsInjector.propTypes[name] = PropTypes.any
    if (isRouteParam[name]) {
      paramsShape[name] = PropTypes.string
    }
  })

  PropsInjector.propTypes.params = PropTypes.shape(paramsShape)

  function resolveCursors ({params}, {tree}) {
    const cursors = assign({}, baseCursors)

    const user = tree.get('user')

    forEach(names, name => {
      const cursor = getCursorToEntity(name, user, params)

      if (cursor) {
        cursors[name] = ['user'].concat(cursor)
      }
    })

    return cursors
  }

  const Branch = branch(resolveCursors, PropsInjector)

  Branch.displayName = 'State-Tree-Branch'

  return injectParams(Branch)
}
