import cx from 'classnames'
import pick from 'lodash/pick'
import trim from 'lodash/trim'
import Message from 'tetris-iso/Message'
import React from 'react'
import TextMessage from 'intl-messageformat'

const {PropTypes} = React
const inputFields = [
  'disabled',
  'name',
  'type',
  'required',
  'max',
  'min'
]

function notEmptyString (value) {
  return value !== '' && value !== undefined && value !== null
}

export const Input = React.createClass({
  displayName: 'Input',
  propTypes: {
    type: PropTypes.string,
    min: PropTypes.number,
    max: PropTypes.number,
    className: PropTypes.string,
    value: PropTypes.any,
    defaultValue: PropTypes.any,
    error: PropTypes.string,
    label: PropTypes.string,
    name: PropTypes.string.isRequired,
    onChange: PropTypes.func
  },
  contextTypes: {
    messages: PropTypes.object,
    locales: PropTypes.string
  },
  getDefaultProps () {
    return {
      type: 'text'
    }
  },
  getInitialState () {
    const value = this.props.value || this.props.defaultValue

    return {
      value,
      isDirty: notEmptyString(value),
      isFocused: false
    }
  },
  getNumberError (input) {
    const {messages: {invalidInput, greaterThanMax, lessThanMin}, locales} = this.context

    let cleanValue = input.value.replace(/[^\d.,-]/g, '')

    let str = ''

    for (let i = 0; i < cleanValue.length; i++) {
      const char = cleanValue[i]
      const canIgnore = (char === '.' || char === ',' || char === '-') && char === str[i - 1]

      if (!canIgnore) {
        str += char
      }
    }

    cleanValue = str.replace(/\D$/g, '')

    if (!input.value) return

    if (input.value !== cleanValue || String(Number(cleanValue)) !== cleanValue) {
      return invalidInput
    }

    const number = Number(cleanValue)

    if (input.max && number > Number(input.max)) {
      return new TextMessage(greaterThanMax, locales).format({max: input.max})
    }

    if (input.min && number < Number(input.min)) {
      return new TextMessage(lessThanMin, locales).format({min: input.min})
    }
  },
  getGenericError (input) {
    if (input.required && !trim(input.value)) {
      return this.context.messages.requiredInput
    }
  },
  handleNewValue (input, fn) {
    let error = this.getGenericError(input)

    if (!error && input.type === 'number') {
      error = this.getNumberError(input)
    }

    error = error || null

    this.setState({
      error,
      value: input.value,
      isDirty: notEmptyString(input.value)
    }, fn)
  },
  onChange (e) {
    e.persist()

    this.handleNewValue(e.target, () => {
      const hasHardError = (
        this.state.error &&
        this.state.error !== this.context.messages.requiredInput
      )

      if (!hasHardError && this.props.onChange) {
        this.props.onChange(e)
      }
    })
  },
  onFocus (e) {
    this.setState({isFocused: true})
  },
  onBlur (e) {
    this.setState({isFocused: false})
  },
  componentWillReceiveProps ({value, min, max}) {
    if (value !== this.props.value || min !== this.props.min || max !== this.props.max) {
      this.refs.input.value = value
      this.refs.input.min = min
      this.refs.input.max = max
      this.handleNewValue(this.refs.input)
    }
  },
  render () {
    const {isDirty, isFocused} = this.state
    const error = this.state.error || this.props.error
    const {label} = this.props
    const wrapperClasses = cx('mdl-textfield',
      label && 'mdl-textfield--floating-label',
      error && 'is-invalid',
      isDirty && 'is-dirty',
      isFocused && 'is-focused')

    return (
      <div className={wrapperClasses}>

        <input
          {...pick(this.props, inputFields)}
          ref='input'
          value={this.state.value}
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
