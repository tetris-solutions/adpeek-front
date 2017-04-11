import React from 'react'
import PropTypes from 'prop-types'
import cx from 'classnames'
const isBrowser = typeof document !== 'undefined'

export class Switch extends React.Component {
  static displayName = 'Switch'

  static propTypes = {
    name: PropTypes.string,
    onChange: PropTypes.func,
    label: PropTypes.node,
    checked: PropTypes.bool
  }

  state = {
    checked: Boolean(this.props.checked)
  }

  onChange = (e) => {
    this.setState({
      checked: e.target.checked
    })

    if (this.props.onChange) {
      this.props.onChange(e)
    }
  }

  componentDidMount () {
    window.componentHandler.upgradeElement(this.refs.wrapper)
  }

  render () {
    const wrapperClasses = cx('mdl-switch',
      isBrowser && 'mdl-js-switch mdl-js-ripple-effect')
    const {name, label} = this.props

    return (
      <label className={wrapperClasses} ref='wrapper'>
        <input
          type='checkbox'
          name={name}
          className='mdl-switch__input'
          checked={this.state.checked}
          onChange={this.onChange}/>
        <span className='mdl-switch__label'>{label}</span>
      </label>
    )
  }
}

export default Switch
