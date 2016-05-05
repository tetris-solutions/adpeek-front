import React from 'react'
import window from 'global/window'

const {PropTypes} = React

export const Switch = React.createClass({
  displayName: 'Switch',
  propTypes: {
    onSwitch: PropTypes.func,
    label: PropTypes.string,
    checked: PropTypes.bool
  },
  getInitialState () {
    return {
      checked: Boolean(this.props.checked)
    }
  },
  onChange ({target: {checked}}) {
    this.setState({checked})
    this.props.onSwitch(checked)
  },
  componentDidMount () {
    window.componentHandler.upgradeElement(this.refs.wrapper)
  },
  render () {
    return (
      <label className='mdl-switch mdl-js-switch mdl-js-ripple-effect' ref='wrapper'>
        <input type='checkbox' className='mdl-switch__input' checked={this.state.checked} onChange={this.onChange}/>
        <span className='mdl-switch__label'>{this.props.label}</span>
      </label>
    )
  }
})

export default Switch
