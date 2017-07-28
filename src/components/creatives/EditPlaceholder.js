import React from 'react'
import PropTypes from 'prop-types'

class EditPlaceholder extends React.Component {
  static displayName = 'Edit-Placeholder'

  static propTypes = {
    route: PropTypes.shape({
      path: PropTypes.string
    }).isRequired
  }

  static contextTypes = {
    messages: PropTypes.object.isRequired,
    router: PropTypes.object.isRequired
  }

  componentDidMount () {
    this.context.router.setRouteLeaveHook(this.props.route, this.onLeave)
    window.addEventListener('beforeunload', this.onUnload)
  }

  componentWillUnmount () {
    window.removeEventListener('beforeunload', this.onUnload)
  }

  onUnload = (e) => {
    if (!this.skipPrompt) {
      e.returnValue = this.context.messages.leaveCreativesPrompt
      this.skipPrompt = true
    }
  }

  onLeave = () => {
    if (!this.skipPrompt) {
      this.skipPrompt = true
      return this.context.messages.leaveCreativesPrompt
    }

    return true
  }

  render () {
    return null
  }
}

export default EditPlaceholder
