import cx from 'classnames'
import pick from 'lodash/pick'
import trim from 'lodash/trim'
import Message from 'tetris-iso/Message'
import React from 'react'
import isNumber from 'lodash/isNumber'
import isString from 'lodash/isString'
import assign from 'lodash/assign'
import TextMessage from 'intl-messageformat'
import {prettyNumber} from '../functions/pretty-number'

const {PropTypes} = React
const inputFields = [
  'disabled',
  'readOnly',
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
    children: PropTypes.node,
    readOnly: PropTypes.bool,
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
    format: PropTypes.oneOf(['currency', 'percentage', 'decimal'])
  },
  contextTypes: {
    messages: PropTypes.object,
    locales: PropTypes.string
  },
  getDefaultProps () {
    return {
      type: 'text',
      format: 'decimal'
    }
  },
  getInitialState () {
    return {isFocused: false}
  },
  getValue () {
    return this.state.value
  },
  componentWillMount () {
    let value = this.props.value === undefined
      ? this.props.defaultValue
      : this.props.value

    if (this.props.type === 'number') {
      value = this.formatNumber(value)
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
    this.input.inputMaskToNumber = () => this.getRawNumber(this.state.value)
  },
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
        nextProps.format !== this.props.format ||
        nextContext.locales !== this.context.locales
      )

      if (hasNumberChanged || haveFormatRulesChanged) {
        newState.value = this.formatNumber(newPropsValue, nextProps.format, nextContext.locales)
      }
    } else if (newPropsValue !== oldPropsValue && newPropsValue !== stateValue) {
      newState.value = newPropsValue
    }

    newState.error = this.getError(assign({}, this.state, nextProps, newState))

    if (newState.value !== undefined || newState.error !== this.state.error) {
      newState.isDirty = notEmptyString(newState.value)
      this.setState(newState)
    }
  },
  getRawNumber (value) {
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
        .replace(/[^0-9-.]/g, '')
        .replace(/\D$/g, '')
    )
  },
  formatNumber (val, format = this.props.format, locale = this.context.locales) {
    if (isString(val)) {
      val = this.getRawNumber(val)
    }

    if (!isNumber(val)) return ''

    if (format === 'percentage') {
      return prettyNumber(val, 'decimal', locale) + ' %'
    } else {
      return prettyNumber(val, format, locale)
    }
  },
  getNumberError (input) {
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

    this.setState({
      error,
      value: input.value,
      isDirty: notEmptyString(input.value)
    }, onStateChange)
  },
  onFocus () {
    this.setState({isFocused: true})
  },
  onBlur () {
    const {value} = this.state

    this.setState({
      isFocused: false,
      value: this.props.type === 'number' ? this.formatNumber(value) : value
    })
  },
  render () {
    const {value, isDirty, isFocused} = this.state
    const {label, children} = this.props
    const error = this.state.error || this.props.error

    const wrapperClasses = cx('mdl-textfield',
      label && 'mdl-textfield--floating-label',
      error && 'is-invalid',
      isDirty && 'is-dirty',
      isFocused && 'is-focused')

    const Tag = 'input'

    const inputProps = assign(pick(this.props, inputFields), {
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

        <Tag {...inputProps}/>

        {label && (
          <label className='mdl-textfield__label'>
            <Message>{label + 'Label'}</Message>
          </label>)}

        {error && (<span className='mdl-textfield__error'>{error}</span>)}
        {children}
      </div>
    )
  }
})

export default Input
