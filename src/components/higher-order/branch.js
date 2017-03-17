import React from 'react'
import isFunction from 'lodash/isFunction'
import findIndex from 'lodash/findIndex'
import isString from 'lodash/isString'
import isArray from 'lodash/isArray'
import isObject from 'lodash/isPlainObject'
import isNumber from 'lodash/isNumber'
import forEach from 'lodash/forEach'
import assign from 'lodash/assign'
import find from 'lodash/find'
import concat from 'lodash/concat'
import omit from 'lodash/omit'
import endsWith from 'lodash/endsWith'

const plural = name => endsWith(name, 'y')
  ? name.substr(0, name.length - 1) + 'ies'
  : name + 's'

const mappingToCursors = (mapping, props, context) =>
  isFunction(mapping)
    ? mapping(props, context)
    : mapping

const Placeholder = props => props.children
  ? React.cloneElement(props.children, omit(props, 'children'))
  : null

Placeholder.displayName = 'Node'
Placeholder.propTypes = {
  children: React.PropTypes.node
}

/**
 * @param {String|Function|Object} mapping cursor mapping
 * @param {Function} Component component to extend
 * @param {Number} [maxWatchDepth=1] max tree depth to watch
 * @return {Function} extended component
 */
export function branch (mapping, Component = Placeholder, maxWatchDepth = 1) {
  if (isString(mapping)) {
    mapping = {[mapping]: [mapping]}
  }

  function matches (watchedPath, updatedPath) {
    if (!isArray(watchedPath) || !isArray(updatedPath)) {
      return false
    }

    const levelsBellow = updatedPath.length - watchedPath.length

    if (levelsBellow > maxWatchDepth || levelsBellow < 0) {
      return false
    }

    for (let i = 0; i < watchedPath.length; i++) {
      const watchedPart = isNumber(watchedPath[i])
        ? String(watchedPath[i])
        : watchedPath[i]

      const updatedPart = isNumber(updatedPath[i])
        ? String(updatedPath[i])
        : updatedPath[i]

      if (watchedPart !== updatedPart) {
        return false
      }
    }

    return true
  }

  function matchUpdatedPath (watchedPath, {data: {paths}}) {
    for (let i = 0; i < paths.length; i++) {
      if (matches(watchedPath, paths[i])) {
        return paths[i]
      }
    }

    return false
  }

  return React.createClass({
    displayName: `branch(${Component.displayName})`,
    contextTypes: {
      tree: React.PropTypes.object.isRequired,
      cursors: React.PropTypes.object,
      params: React.PropTypes.object
    },
    childContextTypes: {
      cursors: React.PropTypes.object
    },
    propTypes: {
      params: React.PropTypes.object
    },
    componentWillMount () {
      const {tree} = this.context

      this.dispatcher = (fn, ...args) => fn(tree, ...args)
    },
    getChildContext () {
      return {
        cursors: assign({}, this.context.cursors, this.getCursors())
      }
    },
    componentDidMount () {
      const {tree} = this.context

      tree.on('update', this.onUpdate)

      this.release = () => {
        this.dead = true
        tree.off('update', this.onUpdate)
      }
    },
    onUpdate (event) {
      const relatedToEvent = path => matchUpdatedPath(path, event)
      const changedPath = find(this.getCursors(), relatedToEvent)

      if (changedPath) {
        this.refresh()
      }
    },
    componentWillUnmount () {
      if (this.release) {
        this.release()
      }
    },
    getCursors () {
      return mappingToCursors(
        mapping,
        this.extendedProps(),
        this.context
      )
    },
    getParams () {
      return assign({}, this.context.params, this.props.params)
    },
    extendedProps () {
      return assign({}, this.props, {
        params: this.getParams()
      })
    },
    refresh () {
      if (!this.dead) {
        this.forceUpdate()
      }
    },
    render () {
      const {tree} = this.context
      const props = this.extendedProps()

      props.cursors = {}
      props.dispatch = this.dispatcher

      forEach(this.getCursors(), (path, name) => {
        const val = tree.get(path)

        props[name] = val === undefined ? null : val

        Object.defineProperty(props.cursors, name, {
          get () {
            return tree.get(path)
          },
          enumerable: true
        })
      })

      return <Component {...props} />
    }
  })
}

/**
 * @param {String|Function} parent parent cursor
 * @param {String} name cursor name
 * @param {Function} resolverOrComponent resolver fn or component
 * @param {Function} [Component] component to extend
 * @param {Number} [maxDepthWatch=1] max tree depth to watch
 * @return {Function} extended component
 */
export function derivative (parent, name, resolverOrComponent, Component, maxDepthWatch = 1) {
  const resolver = Component
    ? resolverOrComponent
    : () => name

  Component = Component || resolverOrComponent

  return React.createClass({
    displayName: `${name}(${Component.displayName})`,
    contextTypes: {
      tree: React.PropTypes.object.isRequired,
      cursors: React.PropTypes.object.isRequired
    },
    componentWillMount () {
      const solver = (props, context) => {
        const {tree, cursors} = this.context
        const parentPath = cursors[isString(parent) ? parent : parent(props, context)]

        if (!parentPath) return {}

        const parentValue = tree.get(parentPath)

        if (parentValue === undefined) return {}

        const subPath = resolver(parentValue, props, context)

        return subPath === 0 || subPath
          ? {[name]: concat(parentPath, subPath)}
          : {}
      }

      this.Branch = branch(solver, Component, maxDepthWatch)
    },
    render () {
      const {Branch} = this

      return <Branch {...this.props}/>
    }
  })
}

export const collection = derivative

/**
 * @param {String|Function} parent parent cursor name
 * @param {String} name cursor name
 * @param {Function} Component component to extend
 * @param {Number} [maxDepthWatch=1] max depth for watching
 * @return {Function} extended component
 */
export const node = (parent, name, Component = Placeholder, maxDepthWatch = 1) =>
  derivative(parent, name, (node, {params}) => {
    if (!node) return null

    const list = isArray(node)
      ? node
      : node[plural(name)]

    const index = findIndex(list, {id: params[name]})

    if (index === -1) return null

    return list === node
      ? index
      : [plural(name), index]
  }, Component, maxDepthWatch)

/**
 * @param {Array} maps maps to use for injection
 * @param {Function} Component react component to extend
 * @return {Function} extended component
 */
export function many (maps, Component) {
  forEach(maps.reverse(), mapping => {
    if (isObject(mapping)) {
      Component = branch(mapping, Component)
    } else {
      Component = node(...mapping.concat([Component]))
    }
  })

  return Component
}
