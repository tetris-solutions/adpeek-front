import cx from 'classnames'
import pick from 'lodash/pick'
import trim from 'lodash/trim'
import Message from 'tetris-iso/Message'
import React from 'react'
import assign from 'lodash/assign'
import MaskedTextInput from 'react-text-mask'
import createNumberMask from 'text-mask-addons/dist/createNumberMask'
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
    onChange: PropTypes.func,
    prefix: PropTypes.string
  },
  contextTypes: {
    messages: PropTypes.object,
    locales: PropTypes.string
  },
  getDefaultProps () {
    return {
      type: 'text',
      prefix: ''
    }
  },
  getInitialState () {
    const value = this.props.value === undefined
      ? this.props.defaultValue
      : this.props.value

    return {
      value,
      isDirty: notEmptyString(value),
      isFocused: false
    }
  },
  toNumber (value) {
    const {locales} = this.context

    const cleanValue = locales === 'pt-BR' ? (
      value.replace(/\./g, '') // strip thousand sep
        .replace(',', '.') // translate decimal sep
    ) : (
      value.replace(/,/g, '') // strip thousand sep
    )

    return Number(cleanValue.replace(/[^0-9-.]/g, '')
      .replace(/\D$/g, ''))
  },
  getNumberError (input) {
    const {messages: {invalidInput, greaterThanMax, lessThanMin}, locales} = this.context

    const number = this.toNumber(input.value)

    if (isNaN(number)) return invalidInput

    if (input.max && number > Number(input.max)) {
      return new TextMessage(greaterThanMax, locales).format({max: input.max})
    }

    if (input.min && number < Number(input.min)) {
      return new TextMessage(lessThanMin, locales).format({min: input.min})
    }

    return null
  },
  onChange (e) {
    const {onChange, type} = this.props
    const input = e.target

    let error = null

    if (input.required && !trim(input.value)) {
      error = this.context.messages.requiredInput
    } else if (type === 'number') {
      error = this.getNumberError(input)
    }

    this.setState({
      error,
      value: input.value,
      isDirty: notEmptyString(input.value)
    })

    if (!error && onChange) {
      onChange({
        target: {
          name: input.name,
          value: type === 'number'
            ? this.toNumber(input.value)
            : input.value
        }
      })
    }
  },
  onFocus () {
    this.setState({isFocused: true})
  },
  onBlur () {
    this.setState({isFocused: false})
  },
  isMask () {
    return this.props.type === 'number'
  },
  componentWillReceiveProps ({value, min, max}) {
    if (value !== this.props.value) {
      this.setState({value})
    }
  },
  render () {
    const {value, isDirty, isFocused} = this.state
    const {prefix, label} = this.props
    const {locales} = this.context
    const error = this.state.error || this.props.error

    const wrapperClasses = cx('mdl-textfield',
      label && 'mdl-textfield--floating-label',
      error && 'is-invalid',
      isDirty && 'is-dirty',
      isFocused && 'is-focused')

    let Tag = 'input'

    const inputProps = assign(pick(this.props, inputFields), {
      ref: 'input',
      value,
      className: 'mdl-textfield__input',
      onChange: this.onChange,
      onBlur: this.onBlur,
      onFocus: this.onFocus
    })

    if (this.isMask()) {
      Tag = MaskedTextInput

      inputProps.type = 'text'
      inputProps.mask = createNumberMask({
        prefix,
        allowDecimal: true,
        decimalSymbol: locales === 'pt-BR' ? ',' : '.',
        thousandsSeparatorSymbol: locales === 'pt-BR' ? '.' : ','
      })
    }

    return (
      <div className={wrapperClasses}>

        <Tag {...inputProps}/>

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
