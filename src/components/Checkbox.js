import React from 'react'
import cx from 'classnames'
import window from 'global/window'

const {PropTypes} = React
const isBrowser = typeof document !== 'undefined'

export const Checkbox = React.createClass({
  displayName: 'Checkbox',
  propTypes: {
    checked: PropTypes.bool,
    name: PropTypes.string.isRequired,
    label: PropTypes.string,
    value: PropTypes.string
  },
  getDefaultProps () {
    return {
      value: 'on'
    }
  },
  componentDidMount () {
    window.componentHandler.upgradeElement(this.refs.wrapper)
  },
  render () {
    const {label, name, checked, value} = this.props
    const classes = cx('mdl-checkbox',
      isBrowser && 'mdl-js-checkbox mdl-js-ripple-effect')

    return (
      <label className={classes} ref='wrapper'>
        <input
          name={name}
          type='checkbox'
          className='mdl-checkbox__input'
          defaultChecked={checked}
          value={value}/>

        {label ? (
          <span className='mdl-checkbox__label'>
            {label}
          </span>) : null}
      </label>
    )
  }
})

export default Checkbox
