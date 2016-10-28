import assign from 'lodash/assign'
import findIndex from 'lodash/findIndex'
import forEach from 'lodash/forEach'
import isObject from 'lodash/isObject'
import keys from 'lodash/keys'
import React from 'react'
import {branch} from 'baobab-react/higher-order'
import {inferLevelFromParams} from '../../functions/infer-level-from-params'

const {PropTypes} = React
const isRouteParam = {
  company: true,
  workspace: true,
  folder: true,
  order: true,
  report: true,
  campaign: true
}
const searchPath = {
  company: [['company', 'companies']]
}

searchPath.workspace = searchPath.company.concat([['workspace', 'workspaces']])
searchPath.folder = searchPath.workspace.concat([['folder', 'folders']])

searchPath.campaign = searchPath.folder.concat([['campaign', 'campaigns']])
searchPath.order = searchPath.folder.concat([['order', 'orders']])

searchPath.report = params => {
  const level = inferLevelFromParams(params)

  return searchPath[level].concat([['report', 'reports']])
}

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
  if (!path) {
    const aux = searchPath[entity]

    if (typeof aux === 'function') {
      path = aux(params)
    } else {
      path = aux.concat()
    }
  }

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
  const propsCache = {}

  if (!isObject(baseCursors)) {
    names.unshift(baseCursors)
    baseCursors = {}
  }

  function PropsInjector (props) {
    function updateCacheForProp (name) {
      if (isRouteParam[name] && !props.params[name]) {
        propsCache[name] = null
      } else {
        propsCache[name] = props[name] || propsCache[name]
      }
    }

    forEach(names, updateCacheForProp)

    return <Component {...props} {...propsCache} />
  }

  const propsNames = keys(baseCursors).concat(names).join(', ')

  function injectParams (Child) {
    const ParamsInjector = (props, {params}) => <Child {...props} params={params}/>

    ParamsInjector.displayName = `Contextualize(${Component.displayName}, ${propsNames})`
    ParamsInjector.contextTypes = {
      params: PropTypes.object.isRequired
    }

    return ParamsInjector
  }

  PropsInjector.displayName = 'Props-Injector'
  PropsInjector.propTypes = {}

  const paramsShape = {}

  function addToDynamicPropTypes (name) {
    PropsInjector.propTypes[name] = PropTypes.any

    if (isRouteParam[name]) {
      paramsShape[name] = PropTypes.string
    }
  }

  forEach(names, addToDynamicPropTypes)

  PropsInjector.propTypes.params = PropTypes.shape(paramsShape)

  function resolveCursors ({params}, {tree}) {
    const cursors = assign({}, baseCursors)
    const user = tree.get('user')

    function findCursorFor (name) {
      if (name === 'user') {
        cursors[name] = ['user']
        return
      }

      const cursor = getCursorToEntity(name, user, params)

      if (cursor) {
        cursors[name] = ['user'].concat(cursor)
      }
    }

    forEach(names, findCursorFor)

    return cursors
  }

  const Branch = branch(resolveCursors, PropsInjector)

  Branch.displayName = 'State-Tree-Branch'

  return injectParams(Branch)
}
