import React from 'react'
import cx from 'classnames'
import pick from 'lodash/pick'
import Message from '@tetris/front-server/lib/components/intl/Message'
import csjs from 'csjs'
import {styled} from './mixins/styled'

const style = csjs`
.select option {
  color: #333
}`

const {PropTypes} = React
const selectFields = [
  'name',
  'type',
  'required',
  'defaultValue',
  'value'
]

export const Select = React.createClass({
  displayName: 'Select',
  mixins: [styled(style)],
  propTypes: {
    children: PropTypes.node,
    value: PropTypes.any,
    defaultValue: PropTypes.any,
    error: PropTypes.string,
    label: PropTypes.string,
    name: PropTypes.string.isRequired,
    onChange: PropTypes.func
  },
  getInitialState () {
    return {
      isDirty: Boolean(this.props.value || this.props.defaultValue),
      isFocused: this.hasEmptyValue()
    }
  },
  hasEmptyValue () {
    const {value, defaultValue, children} = this.props

    if (!value && !defaultValue) {
      const childrenArray = React.Children.toArray(children)

      if (!childrenArray[0] || !childrenArray[0].props.value) {
        return true
      }
    }
    return false
  },
  onChange (e) {
    this.setState({
      isDirty: Boolean(e.target.value)
    })

    if (this.props.onChange) {
      this.props.onChange(e)
    }
  },
  onFocus () {
    this.setState({isFocused: true})
  },
  onBlur () {
    this.setState({isFocused: this.hasEmptyValue()})
  },
  render () {
    const {isDirty, isFocused} = this.state
    const {error, label} = this.props
    const wrapperClasses = cx('mdl-selectfield',
      String(style.select),
      error && 'is-invalid',
      isDirty && 'is-dirty',
      isFocused && 'is-focused',
      label && 'mdl-selectfield--floating-label')

    return (
      <div className={wrapperClasses}>

        <select
          {...pick(this.props, selectFields)}
          className='mdl-selectfield__select'
          onChange={this.onChange}
          onBlur={this.onBlur}
          onFocus={this.onFocus}>

          {this.props.children}
        </select>

        {label && (
          <label className='mdl-selectfield__label'>
            <Message>{label + 'Label'}</Message>
          </label>
        )}

        {error && (<span className='mdl-textfield__error'>{error}</span>)}

      </div>
    )
  }
})

export default Select
