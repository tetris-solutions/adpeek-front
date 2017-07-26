import React from 'react'
import PropTypes from 'prop-types'
import assign from 'lodash/assign'

export const styledFunctionalComponent = (fnComponent, style) => class extends React.Component {
  static displayName = fnComponent.displayName
  static propTypes = fnComponent.propTypes
  static defaultProps = fnComponent.defaultProps || {}

  static contextTypes = assign({
    insertCss: PropTypes.func.isRequired
  }, fnComponent.contextTypes)

  componentWillMount () {
    this.context.insertCss(style)
  }

  render () {
    return fnComponent(this.props, this.context)
  }
}

function exportASHoc (Component, style) {
  return class extends React.Component {
    static displayName = `styled(${Component.displayName})`

    static contextTypes = {
      insertCss: PropTypes.func.isRequired
    }

    componentWillMount () {
      this.context.insertCss(style)
    }

    render () {
      return <Component {...this.props}/>
    }
  }
}

function inherit (Component, style) {
  return class extends Component {
    static contextTypes = assign({
      insertCss: PropTypes.func.isRequired
    }, Component.contextTypes)

    componentWillMount (...args) {
      if (super.componentWillMount) {
        super.componentWillMount(...args)
      }

      this.context.insertCss(style)
    }
  }
}

const isES6Component = c => c.prototype.mixins === undefined

export const styledComponent = (Component, style) =>
  isES6Component(Component)
    ? inherit(Component, style)
    : exportASHoc(Component, style)
