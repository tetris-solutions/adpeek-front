import React from 'react'
import isFunction from 'lodash/isFunction'
import isArray from 'lodash/isArray'
import isNumber from 'lodash/isNumber'
import forEach from 'lodash/forEach'
import assign from 'lodash/assign'
import debounce from 'lodash/debounce'
import loglevel from 'loglevel'

const mappingToCursors = (mapping, props, context) =>
  isFunction(mapping)
    ? mapping(props, context)
    : mapping

function matches (watchedPath, updatedPath) {
  if (!isArray(watchedPath) || !isArray(updatedPath)) {
    return false
  }

  const levelsBellow = updatedPath.length - watchedPath.length

  if (levelsBellow > 1 || levelsBellow < 0) {
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

function findRelatedChangePath (watchedPath, {data: {paths}}) {
  for (let i = 0; i < paths.length; i++) {
    if (matches(watchedPath, paths[i])) {
      return paths[i]
    }
  }

  return false
}

export function branch (mapping, Component) {
  class ComposedComponent extends React.Component {
    componentWillMount () {
      const {tree} = this.context

      this.dispatcher = (fn, ...args) => fn(tree, ...args)

      this.cursors = mappingToCursors(mapping, this.props, this.context)
    }

    componentDidMount () {
      const {tree} = this.context

      this.refresh = debounce(() => {
        if (this.dead) return
        this.forceUpdate()
      }, 300)

      this.onUpdate = this.onUpdate.bind(this)

      tree.on('update', this.onUpdate)

      this.release = () => {
        this.dead = true
        tree.off('update', this.onUpdate)
      }
    }

    onUpdate (event) {
      forEach(this.cursors, path => {
        const changedPath = findRelatedChangePath(path, event)

        if (changedPath) {
          loglevel.debug(`${Component.displayName}) update triggered by change on ${changedPath}`)
          this.refresh()
          return false
        }
      })
    }

    componentWillReceiveProps (props, context) {
      this.cursors = mappingToCursors(mapping, props, context)
    }

    componentWillUnmount () {
      if (this.release) {
        this.release()
      }
    }

    render () {
      const {tree} = this.context
      const suppl = {dispatch: this.dispatcher}
      const props = assign({}, this.props)

      forEach(this.cursors, (path, name) => {
        props[name] = tree.get(path) || null
      })

      return <Component {...props} {...suppl} />
    }
  }

  ComposedComponent.displayName = `branch(${Component.displayName})`
  ComposedComponent.contextTypes = {
    tree: React.PropTypes.object.isRequired
  }

  return ComposedComponent
}
