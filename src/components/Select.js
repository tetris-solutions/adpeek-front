import csjs from 'csjs'
import cx from 'classnames'
import pick from 'lodash/pick'
import Message from 'tetris-iso/Message'
import React from 'react'

import {styled} from './mixins/styled'

const style = csjs`
.select option {
  color: #333
}
.select option[disabled] {
  color: rgb(200, 200, 200)
}`
const selectFields = [
  'disabled',
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
    children: React.PropTypes.node,
    disabled: React.PropTypes.bool,
    value: React.PropTypes.any,
    defaultValue: React.PropTypes.any,
    error: React.PropTypes.string,
    label: React.PropTypes.string,
    name: React.PropTypes.string.isRequired,
    onChange: React.PropTypes.func
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
  onFocus () {
    this.setState({isFocused: true})
  },
  onBlur () {
    this.setState({isFocused: false})
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
