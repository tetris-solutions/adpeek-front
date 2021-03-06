import csjs from 'csjs'
import cx from 'classnames'
import isString from 'lodash/isString'
import pick from 'lodash/pick'
import Message from '@tetris/front-server/Message'
import React from 'react'
import PropTypes from 'prop-types'
import {styledComponent} from './higher-order/styled'

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

export class Select extends React.Component {
  static displayName = 'Select'

  static propTypes = {
    children: PropTypes.node,
    disabled: PropTypes.bool,
    value: PropTypes.any,
    defaultValue: PropTypes.any,
    error: PropTypes.string,
    label: PropTypes.node,
    name: PropTypes.string.isRequired,
    onChange: PropTypes.func
  }

  state = {
    isDirty: Boolean(this.props.value || this.props.defaultValue),
    isFocused: false
  }

  onChange = (e) => {
    this.setState({
      isDirty: Boolean(e.target.value)
    })

    if (this.props.onChange) {
      this.props.onChange(e)
    }
  }

  onFocus = () => {
    this.setState({isFocused: true})
  }

  onBlur = () => {
    this.setState({isFocused: false})
  }

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

        {isString(label) ? (
          <label className='mdl-selectfield__label'>
            <Message>{label + 'Label'}</Message>
          </label>
        ) : label}

        {error && (
          <span className='mdl-textfield__error' style={{visibility: 'visible'}}>
            {error}
          </span>)}

      </div>
    )
  }
}

export default styledComponent(Select, style)
