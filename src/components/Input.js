import cx from 'classnames'
import pick from 'lodash/pick'
import trim from 'lodash/trim'
import Message from 'tetris-iso/Message'
import React from 'react'
import isNumber from 'lodash/isNumber'
import isString from 'lodash/isString'
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
    return {isFocused: false}
  },
  componentWillMount () {
    let value = this.props.value === undefined
      ? this.props.defaultValue
      : this.props.value

    if (this.props.type === 'number') {
      value = this.fromNumber(value)
    }

    const state = {
      value,
      isDirty: notEmptyString(value)
    }

    state.error = this.getError(assign({}, this.props, state))

    this.setState(state)
  },
  componentDidMount () {
    this.input = this.refs.wrapper.querySelector('input')
    this.input.inputMaskToNumber = this.toNumber
  },
  componentWillReceiveProps (nextProps) {
    const stateValue = this.state.value
    const newPropsValue = nextProps.value
    const newState = {}

    if (this.props.type === 'number') {
      const hasValueChanged = this.toNumber(stateValue) !== this.toNumber(newPropsValue)

      if (hasValueChanged) {
        newState.value = this.fromNumber(newPropsValue)
      }

      newState.error = this.getError(assign({}, nextProps, newState))
    } else if (newPropsValue !== stateValue) {
      newState.value = newPropsValue
      newState.error = this.getError(assign({}, nextProps))
    }

    if (newState.value !== undefined && newState.error !== this.state.error) {
      this.setState(newState)
    }
  },
  toNumber (value = this.state.value) {
    if (isNumber(value)) return value
    if (!isString(value)) return 0

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
  fromNumber (val) {
    if (isString(val)) return val
    if (!isNumber(val)) return ''

    return this.context.locales === 'pt-BR'
      ? String(val).replace('.', ',')
      : String(val)
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
  getError (input) {
    let error = null

    if (input.required && !trim(input.value)) {
      error = this.context.messages.requiredInput
    } else if (this.props.type === 'number') {
      error = this.getNumberError(input)
    }

    return error
  },
  onChange (e) {
    const {onChange, type} = this.props
    const input = e.target
    const error = this.getError(input)

    function propagate () {
      onChange({
        target: {
          name: input.name,
          value: type === 'number'
            ? this.toNumber(input.value)
            : input.value
        }
      })
    }

    const callback = !error && onChange ? propagate : undefined

    this.setState({
      error,
      value: input.value,
      isDirty: notEmptyString(input.value)
    }, callback)
  },
  onFocus () {
    this.setState({isFocused: true})
  },
  onBlur () {
    this.setState({isFocused: false})
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
      value,
      className: 'mdl-textfield__input',
      onChange: this.onChange,
      onBlur: this.onBlur,
      onFocus: this.onFocus
    })

    if (inputProps.type === 'number') {
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
      <div className={wrapperClasses} ref='wrapper'>

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
