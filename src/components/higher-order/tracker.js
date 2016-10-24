import React from 'react'
import {sendHitAction} from '../../actions/send-hit'

export function tracker (level, Component = null) {
  return React.createClass({
    displayName: 'Analytics',
    contextTypes: {
      tree: React.PropTypes.node.isRequired
    },
    propTypes: {
      params: React.PropTypes.object.isRequired,
      children: React.PropTypes.node
    },
    componentDidMount () {
      const {params} = this.props
      sendHitAction(
        this.context.tree,
        params.company,
        level,
        level === 'company' ? undefined : params[level]
      )
    },
    render () {
      return Component
        ? <Component {...this.props}/>
        : this.props.children
    }
  })
}
