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
    const {checked} = this.state
    const {name, label} = this.props
    const wrapperClass = cx({
      'mdl-switch': true,
      'mdl-js-switch': isBrowser,
      'mdl-js-ripple-effect': isBrowser
    })
    const labelClass = cx({
      'mdl-switch__label': true,
      'mdl-color-text--blue-800': checked
    })
    const Label = checked ? 'strong' : 'span'

    return (
      <label className={wrapperClass} ref='wrapper'>
        <input
          type='checkbox'
          name={name}
          className='mdl-switch__input'
          checked={checked}
          onChange={this.onChange}/>

        <Label className={labelClass}>
          {label}
        </Label>
      </label>
    )
  }
}

export default Switch
