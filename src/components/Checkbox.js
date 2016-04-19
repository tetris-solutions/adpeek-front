import React from 'react'
import cx from 'classnames'

const {PropTypes} = React

export const Checkbox = React.createClass({
  displayName: 'Checkbox',
  propTypes: {
    onChange: PropTypes.func,
    checked: PropTypes.bool,
    name: PropTypes.string.isRequired,
    label: PropTypes.string.isRequired
  },
  getInitialState () {
    return {
      isChecked: Boolean(this.props.checked)
    }
  },
  onChange (e) {
    this.setState({
      isChecked: Boolean(e.target.checked)
    })

    if (this.props.onChange) {
      this.props.onChange(e)
    }
  },
  render () {
    const {label} = this.props
    const {isChecked} = this.state
    const classes = cx('mdl-checkbox mdl-js-checkbox is-upgraded', isChecked && 'is-checked')

    return (
      <label className={classes}>
        <input type='checkbox' className='mdl-checkbox__input' {...this.props} onChange={this.onChange}/>

        <span className='mdl-checkbox__label'>{label}</span>
        <span className='mdl-checkbox__focus-helper'/>

        <span className='mdl-checkbox__box-outline'>
          <span className='mdl-checkbox__tick-outline'/>
        </span>

        <span className='mdl-checkbox__ripple-container mdl-js-ripple-effect mdl-ripple--center'>
          <span className='mdl-ripple is-animating'/>
        </span>
      </label>
    )
  }
})

export default Checkbox
