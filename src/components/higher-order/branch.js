import React from 'react'
// import {pure} from 'recompose'
import isFunction from 'lodash/isFunction'
import findIndex from 'lodash/findIndex'
import isString from 'lodash/isString'
import isArray from 'lodash/isArray'
import isNumber from 'lodash/isNumber'
import forEach from 'lodash/forEach'
import assign from 'lodash/assign'
import debounce from 'lodash/debounce'
import loglevel from 'loglevel'
import find from 'lodash/find'
import concat from 'lodash/concat'
import omit from 'lodash/omit'

const mappingToCursors = (mapping, props, context) =>
  isFunction(mapping)
    ? mapping(props, context)
    : mapping

const ByPass = props => props.children
  ? React.cloneElement(props.children, omit(props, 'children'))
  : null

ByPass.displayName = 'Node'
ByPass.propTypes = {
  children: React.PropTypes.node
}

export function branch (mapping, Component = ByPass, maxWatchDepth = 1) {
  if (isString(mapping)) {
    mapping = {[mapping]: [mapping]}
  }

  function matches (watchedPath, updatedPath) {
    function reject () {
      loglevel.debug(`${Component.displayName}) wont update because changes on ${updatedPath} should not reflect on ${watchedPath}`)
      return false
    }

    if (!isArray(watchedPath) || !isArray(updatedPath)) {
      return reject()
    }

    const levelsBellow = updatedPath.length - watchedPath.length

    if (levelsBellow > maxWatchDepth || levelsBellow < 0) {
      return reject()
    }

    for (let i = 0; i < watchedPath.length; i++) {
      const watchedPart = isNumber(watchedPath[i])
        ? String(watchedPath[i])
        : watchedPath[i]

      const updatedPart = isNumber(updatedPath[i])
        ? String(updatedPath[i])
        : updatedPath[i]

      if (watchedPart !== updatedPart) {
        return reject()
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

      this.refresh = debounce(() => {
        if (this.dead) return
        this.forceUpdate()
      }, 500)

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
        loglevel.debug(`${Component.displayName}) update triggered by change on ${changedPath}`)
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
    render () {
      const {tree} = this.context
      const props = this.extendedProps()

      props.dispatch = this.dispatcher

      forEach(this.getCursors(), (path, name) => {
        props[name] = tree.get(path) || null
      })

      return <Component {...props} />
    }
  })
}

export function derivative (parent, name, resolverOrComponent, Component) {
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
        const subPath = resolver(parentValue, props, context)

        return subPath === 0 || subPath
          ? {[name]: concat(parentPath, subPath)}
          : {}
      }

      this.Branch = branch(solver, Component)
    },
    render () {
      const {Branch} = this

      return <Branch {...this.props}/>
    }
  })
}

export const collection = derivative

const plural = name => name === 'company' ? 'companies' : name + 's'

export const node = (parent, name, Component = ByPass) =>
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
  }, Component)
