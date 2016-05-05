import React from 'react'
import window from 'global/window'
import cx from 'classnames'

const {PropTypes} = React
const isBrowser = typeof document !== 'undefined'

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
    const wrapperClasses = cx('mdl-switch',
      isBrowser && 'mdl-js-switch mdl-js-ripple-effect')

    return (
      <label className={wrapperClasses} ref='wrapper'>
        <input type='checkbox' className='mdl-switch__input' checked={this.state.checked} onChange={this.onChange}/>
        <span className='mdl-switch__label'>{this.props.label}</span>
      </label>
    )
  }
})

export default Switch
