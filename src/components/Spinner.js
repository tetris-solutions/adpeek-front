import React from 'react'

const Spinner = React.createClass({
  displayName: 'Spinner',
  componentDidMount () {
    window.componentHandler.upgradeElement(this.refs.spin)
  },
  render () {
    return (
      <div ref='spin' className='mdl-spinner mdl-spinner--single-color mdl-js-spinner is-active'/>
    )
  }
})

export default Spinner
