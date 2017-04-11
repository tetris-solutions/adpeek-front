import React from 'react'

class Spinner extends React.Component {
  static displayName = 'Spinner'

  componentDidMount () {
    window.componentHandler.upgradeElement(this.refs.spin)
  }

  render () {
    return (
      <div ref='spin' className='mdl-spinner mdl-spinner--single-color mdl-js-spinner is-active'/>
    )
  }
}

export default Spinner
