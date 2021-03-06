import cx from 'classnames'
import debounce from 'lodash/debounce'
import React from 'react'

import PropTypes from 'prop-types'

export class HeaderSearchBox extends React.Component {
  static displayName = 'Header-Search-Box'

  static propTypes = {
    className: PropTypes.string,
    value: PropTypes.any,
    defaultValue: PropTypes.any,
    onChange: PropTypes.func
  }

  state = {
    isDirty: Boolean(this.props.value || this.props.defaultValue),
    isFocused: false
  }

  componentWillMount () {
    this.save = debounce(value => this.props.onChange(value), 300)
  }

  manuallySetFocus = () => {
    this.setState({isFocused: true},
      () => this.refs.input.focus())
  }

  onChange = (e) => {
    this.setState({
      isDirty: Boolean(e.target.value)
    })

    this.save(e.target.value)
  }

  onFocus = () => {
    this.setState({isFocused: true})
  }

  onBlur = () => {
    this.setState({isFocused: false})
  }

  render () {
    const {isDirty, isFocused} = this.state
    const wrapperClasses = cx('mdl-textfield mdl-textfield--expandable mdl-textfield--floating-label mdl-textfield--align-right',
      isDirty && 'is-dirty',
      isFocused && 'is-focused')

    return (
      <div className={wrapperClasses}>
        <label className='mdl-button mdl-button--icon' onClick={this.manuallySetFocus}>
          <i className='material-icons'>search</i>
        </label>
        <div className='mdl-textfield__expandable-holder'>
          <input
            ref='input'
            onChange={this.onChange}
            onBlur={this.onBlur}
            onFocus={this.onFocus}
            className='mdl-textfield__input'
            type='text'
            name='search'/>
        </div>
      </div>
    )
  }
}

export default HeaderSearchBox
