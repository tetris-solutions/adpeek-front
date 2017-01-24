import assign from 'lodash/assign'
import findIndex from 'lodash/findIndex'
import forEach from 'lodash/forEach'
import isObject from 'lodash/isObject'
import React from 'react'
import {branch} from './branch'
import {inferLevelFromParams} from '../../functions/infer-level-from-params'

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

const s = name => [[name, name + 's']]

searchPath.workspace = searchPath.company.concat(s('workspace'))
searchPath.folder = searchPath.workspace.concat(s('folder'))

searchPath.campaign = searchPath.folder.concat(s('campaign'))
searchPath.order = searchPath.folder.concat(s('order'))

searchPath.report = params => searchPath[inferLevelFromParams(params)].concat(s('report'))

searchPath.module = params => searchPath.report(params).concat(s('module'))

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
 * @param {...String} propNames context dependent properties names
 * @return {Function} the extended react component
 */
export function contextualize (Component, baseCursors, ...propNames) {
  const injectedProps = {}

  if (!isObject(baseCursors)) {
    propNames.unshift(baseCursors)
    baseCursors = {}
  }

  function PropsInjector (parentProps) {
    function injectProp (name) {
      if (isRouteParam[name] && !parentProps.params[name]) {
        injectedProps[name] = null
      } else {
        injectedProps[name] = parentProps[name] || injectedProps[name] || null
      }
    }

    forEach(propNames, injectProp)

    return <Component {...parentProps} {...injectedProps} />
  }

  function injectParams (Branch) {
    const ParamsInjector = (props, context) => {
      return <Branch {...props} params={assign({}, props.params, context.params)}/>
    }

    ParamsInjector.displayName = `contextualize(${Branch.displayName}>)`
    ParamsInjector.propTypes = {
      params: React.PropTypes.object
    }
    ParamsInjector.contextTypes = {
      params: React.PropTypes.object.isRequired
    }

    return ParamsInjector
  }

  PropsInjector.displayName = `wrap(${Component.displayName})`
  PropsInjector.propTypes = {}

  const paramsShape = {}

  function addToDynamicPropTypes (name) {
    PropsInjector.propTypes[name] = React.PropTypes.any

    if (isRouteParam[name]) {
      paramsShape[name] = React.PropTypes.string
    }
  }

  forEach(propNames, addToDynamicPropTypes)

  PropsInjector.propTypes.params = React.PropTypes.shape(paramsShape)

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

    forEach(propNames, findCursorFor)

    return cursors
  }

  return injectParams(branch(resolveCursors, PropsInjector))
}
