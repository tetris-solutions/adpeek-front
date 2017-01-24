import React from 'react'
import isFunction from 'lodash/isFunction'
import forEach from 'lodash/forEach'
import assign from 'lodash/assign'

const mappingToCursors = (mapping, props, context) =>
  isFunction(mapping)
    ? mapping(props, context)
    : mapping

export function branch (mapping, Component) {
  class ComposedComponent extends React.Component {
    componentWillMount () {
      const {tree} = this.context

      this.dispatcher = (fn, ...args) => fn(tree, ...args)

      this.cursors = mappingToCursors(mapping, this.props, this.context)
    }

    componentDidMount () {
      const {tree} = this.context

      this.onUpdate = this.onUpdate.bind(this)

      tree.on('update', this.onUpdate)

      this.release = () => tree.off('update', this.onUpdate)
    }

    onUpdate (event) {
      // debugger
    }

    componentWillReceiveProps (props, context) {
      this.cursors = mappingToCursors(mapping, props, context)
    }

    componentWillUnmount () {
      this.release()
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
