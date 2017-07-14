import cx from 'classnames'
import trim from 'lodash/trim'
import Message from 'tetris-iso/Message'
import React from 'react'
import PropTypes from 'prop-types'
import isNumber from 'lodash/isNumber'
import isString from 'lodash/isString'
import assign from 'lodash/assign'
import TextMessage from 'intl-messageformat'
import {prettyNumber} from '../functions/pretty-number'
import omit from 'lodash/omit'

function emptyInput (value) {
  return value === '' || value === undefined || value === null
}

const protectedInputProps = [
  'className',
  'value',
  'onChange',
  'onBlur',
  'onFocus',
  'defaultValue',
  'children',
  'error',
  'label',
  'format',
  'currency'
]

export class Input extends React.Component {
  static displayName = 'Input'

  static propTypes = {
    children: PropTypes.node,
    readOnly: PropTypes.bool,
    currency: PropTypes.string,
    type: PropTypes.string,
    min: PropTypes.number,
    max: PropTypes.number,
    className: PropTypes.string,
    value: PropTypes.any,
    defaultValue: PropTypes.any,
    error: PropTypes.string,
    label: PropTypes.node,
    name: PropTypes.string.isRequired,
    onChange: PropTypes.func,
    format: PropTypes.oneOf(['currency', 'percentage', 'decimal'])
  }

  static contextTypes = {
    messages: PropTypes.object,
    locales: PropTypes.string
  }

  static defaultProps = {
    type: 'text',
    format: 'decimal',
    currency: null
  }

  state = {
    touched: false,
    isFocused: false
  }

  getValue = () => {
    return this.state.value
  }

  componentWillMount () {
    let value = this.props.value === undefined
      ? this.props.defaultValue
      : this.props.value

    if (this.props.type === 'number') {
      value = this.formatNumber(value)
    }

    const state = {
      value: value === undefined ? '' : value
    }

    this.setState(state)
  }

  componentDidMount () {
    this.input = this.refs.wrapper.querySelector('input')
    this.input.inputMaskToNumber = () => this.getRawNumber(this.state.value)
  }

  componentWillReceiveProps (nextProps, nextContext) {
    const oldPropsValue = this.props.value
    const stateValue = this.state.value
    const newPropsValue = nextProps.value
    const newState = {}

    if (this.props.type === 'number') {
      const hasNumberChanged = (
        this.getRawNumber(oldPropsValue) !== this.getRawNumber(newPropsValue) &&
        this.getRawNumber(stateValue) !== this.getRawNumber(newPropsValue)
      )

      const haveFormatRulesChanged = (
        nextProps.currency !== this.props.currency ||
        nextProps.format !== this.props.format ||
        nextContext.locales !== this.context.locales
      )

      if (hasNumberChanged || haveFormatRulesChanged) {
        newState.value = this.formatNumber(newPropsValue, nextProps.format, nextContext.locales, nextProps.currency)
      }
    } else if (newPropsValue !== oldPropsValue && newPropsValue !== stateValue) {
      newState.value = newPropsValue
    }

    this.setState(newState)
  }

  getRawNumber = (value) => {
    if (isNumber(value)) return value
    if (!isString(value)) return 0

    const {locales} = this.context

    const cleanValue = locales === 'pt-BR' ? (
      value.replace(/\./g, '') // strip thousand sep
        .replace(',', '.') // translate decimal sep
    ) : (
      value.replace(/,/g, '') // strip thousand sep
    )

    return Number(
      cleanValue
        .replace(/[^0-9-.]/g, '') // clean up
        .replace(/\D$/g, '') // ignore trailing decimal separator << 100. => 100 >>
    )
  }

  formatNumber = (val, format = this.props.format, locale = this.context.locales, currency = this.props.currency) => {
    if (isString(val)) {
      val = this.getRawNumber(val)
    }

    if (!isNumber(val)) return ''

    if (format === 'percentage') {
      return prettyNumber(val, 'decimal', locale, currency) + ' %'
    } else {
      return prettyNumber(val, format, locale, currency)
    }
  }

  getNumberError = (input) => {
    const {messages: {invalidInput, greaterThanMax, lessThanMin}, locales} = this.context

    const number = this.getRawNumber(input.value)

    if (isNaN(number)) return invalidInput

    if (input.max && number > Number(input.max)) {
      return new TextMessage(greaterThanMax, locales).format({max: input.max})
    }

    if (input.min && number < Number(input.min)) {
      return new TextMessage(lessThanMin, locales).format({min: input.min})
    }

    return null
  }

  getError = (input) => {
    let error = null

    if (this.state.touched && input.required && !trim(input.value)) {
      error = this.context.messages.requiredInput
    } else if (this.props.type === 'number') {
      error = this.getNumberError(input)
    }

    return error
  }

  onChange = (e) => {
    const {onChange, type} = this.props
    const input = e.target
    const error = this.getError(input)

    const propagate = () =>
      onChange({
        target: {
          name: input.name,
          value: type === 'number'
            ? this.getRawNumber(input.value)
            : input.value
        }
      })

    const onStateChange = !error && onChange ? propagate : undefined

    this.setState({value: input.value}, onStateChange)
  }

  onFocus = () => {
    this.setState({isFocused: true})
  }

  onBlur = () => {
    const {value} = this.state

    this.setState({
      touched: true,
      isFocused: false,
      value: this.props.type === 'number' ? this.formatNumber(value) : value
    })
  }

  render () {
    const {value, isFocused} = this.state
    const {label, children} = this.props
    const error = this.getError(assign({}, this.props, this.state)) || this.props.error

    const wrapperClasses = cx({
      'mdl-textfield': true,
      'mdl-textfield--floating-label': Boolean(label),
      'is-invalid': Boolean(error),
      'is-dirty': !emptyInput(value),
      'is-focused': isFocused
    })

    const inputProps = assign(omit(this.props, protectedInputProps), {
      value,
      className: 'mdl-textfield__input',
      onChange: this.onChange,
      onBlur: this.onBlur,
      onFocus: this.onFocus
    })

    if (inputProps.type === 'number') {
      inputProps.type = 'text'
    }

    return (
      <div className={wrapperClasses} ref='wrapper'>
        <input {...inputProps}/>

        {isString(label)
          ? (
            <label className='mdl-textfield__label'>
              <Message>{label + 'Label'}</Message>
            </label>)
          : label}

        {error && (<span className='mdl-textfield__error'>{error}</span>)}
        {children}
      </div>
    )
  }
}

export default Input
