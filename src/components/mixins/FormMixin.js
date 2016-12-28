import React from 'react'
import isEmpty from 'lodash/isEmpty'
import assign from 'lodash/assign'
import omit from 'lodash/omit'

export default {
  getChildContext () {
    return {
      submitInProgress: this.state.submitInProgress
    }
  },
  childContextTypes: {
    submitInProgress: React.PropTypes.bool.isRequired
  },
  contextTypes: {
    messages: React.PropTypes.object
  },
  getInitialState () {
    return {
      submitInProgress: false,
      errors: {}
    }
  },
  componentWillUnmount () {
    this.dead = true
  },
  handleSubmitException (rejection) {
    if (this.dead) return

    const err = 'Response' in window && rejection instanceof window.Response
      ? rejection.data
      : rejection

    if (err && !isEmpty(err.fields)) {
      this.setState({
        errors: assign(this.state.errors, err.fields)
      })
    }
  },
  dismissError ({target: {name}}) {
    const {errors} = this.state

    if (!errors[name]) return

    this.setState({
      errors: omit(errors, name)
    })
  },
  preSubmit () {
    this.setState({errors: {}, submitInProgress: true})
  },
  posSubmit () {
    if (this.dead) return

    this.setState({submitInProgress: false})
  }
}
