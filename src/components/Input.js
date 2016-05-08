import React from 'react'
import cx from 'classnames'
import pick from 'lodash/pick'
import Message from '@tetris/front-server/lib/components/intl/Message'

const {PropTypes} = React
const inputFields = [
  'name',
  'type',
  'required',
  'defaultValue',
  'value'
]

export const Input = React.createClass({
  displayName: 'Input',
  propTypes: {
    type: PropTypes.string,
    className: PropTypes.string,
    value: PropTypes.any,
    defaultValue: PropTypes.any,
    error: PropTypes.string,
    label: PropTypes.string.isRequired,
    name: PropTypes.string.isRequired,
    onChange: PropTypes.func
  },
  getDefaultProps () {
    return {
      type: 'text'
    }
  },
  getInitialState () {
    return {
      isDirty: Boolean(this.props.value || this.props.defaultValue),
      isFocused: false
    }
  },
  onChange (e) {
    this.setState({
      isDirty: Boolean(e.target.value)
    })

    if (this.props.onChange) {
      this.props.onChange(e)
    }
  },
  onFocus (e) {
    this.setState({isFocused: true})
  },
  onBlur (e) {
    this.setState({isFocused: false})
  },
  render () {
    const {isDirty, isFocused} = this.state
    const {error, label} = this.props
    const wrapperClasses = cx('mdl-textfield',
      label && 'mdl-textfield--floating-label',
      error && 'is-invalid',
      isDirty && 'is-dirty',
      isFocused && 'is-focused')

    return (
      <div className={wrapperClasses}>

        <input {...pick(this.props, inputFields)}
          className='mdl-textfield__input'
          onChange={this.onChange}
          onBlur={this.onBlur}
          onFocus={this.onFocus}/>

        {label && (
          <label className='mdl-textfield__label'>
            <Message>{label + 'Label'}</Message>
          </label>
        )}

        {error && (<span className='mdl-textfield__error'>{error}</span>)}

      </div>
    )
  }
})

export default Input
