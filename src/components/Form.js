import React from 'react'
import PropTypes from 'prop-types'
import isFunction from 'lodash/isFunction'

const isPromise = r => r && isFunction(r.then)

class Form extends React.PureComponent {
  static displayName = 'Form'
  static propTypes = {
    onSubmit: PropTypes.func.isRequired,
    children: PropTypes.node.isRequired
  }

  static childContextTypes = {
    submitInProgress: PropTypes.bool
  }

  state = {
    submitInProgress: false
  }

  getChildContext () {
    return {
      submitInProgress: this.state.submitInProgress
    }
  }

  handleSubmit = e => {
    e.preventDefault()

    const result = this.props.onSubmit(e)

    if (!isPromise(result)) return

    this.setState({
      submitInProgress: true
    })

    result.then(() => this.setState({
      submitInProgress: false
    }))
  }

  render () {
    return (
      <form onSubmit={this.handleSubmit}>
        {this.props.children}
      </form>
    )
  }
}

export default Form
