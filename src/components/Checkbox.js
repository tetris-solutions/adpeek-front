import React from 'react'
import cx from 'classnames'
const isBrowser = typeof document !== 'undefined'

function checkBetween (first, last) {
  if (!first || first === last) return

  const {form: {elements}} = first

  function changeToMatchFirst ({programaticallyCheck, programaticallyUncheck}) {
    if (!programaticallyCheck) return

    if (first.checked) {
      programaticallyCheck()
    } else {
      programaticallyUncheck()
    }
  }

  let lastIndex = null
  let firstIndex = null
  let i

  for (i = 0; i < elements.length; i++) {
    const input = elements[i]

    if (input === first) firstIndex = i
    if (input === last) lastIndex = i

    if (firstIndex !== null && lastIndex !== null) break
  }

  if (firstIndex > lastIndex) {
    for (i = firstIndex; i >= lastIndex; i--) {
      changeToMatchFirst(elements[i])
    }
  } else {
    for (i = firstIndex; i <= lastIndex; i++) {
      changeToMatchFirst(elements[i])
    }
  }
}

export const Checkbox = React.createClass({
  displayName: 'Checkbox',
  propTypes: {
    checked: React.PropTypes.bool,
    disabled: React.PropTypes.bool,
    name: React.PropTypes.string.isRequired,
    label: React.PropTypes.node,
    value: React.PropTypes.string
  },
  getDefaultProps () {
    return {
      value: 'on'
    }
  },
  getInitialState () {
    return {
      checked: Boolean(this.props.checked)
    }
  },
  check () {
    this.refs.input.parentNode.MaterialCheckbox.check()
    this.setState({checked: true})
  },
  uncheck () {
    this.refs.input.parentNode.MaterialCheckbox.uncheck()
    this.setState({checked: false})
  },
  componentDidMount () {
    const {input, wrapper} = this.refs

    input.programaticallyCheck = this.check
    input.programaticallyUncheck = this.uncheck

    window.componentHandler.upgradeElement(wrapper)
  },
  onChange ({target, nativeEvent: {shiftKey, ctrlKey}}) {
    function onCheckStateChanged () {
      if (!target.form) return

      if (shiftKey || ctrlKey) {
        checkBetween(target.form._lastChecked, target)
      }

      target.form._lastChecked = target
    }

    this.setState({checked: target.checked}, onCheckStateChanged)
  },
  render () {
    const {label, name, value, disabled} = this.props
    const classes = cx('mdl-checkbox',
      isBrowser && 'mdl-js-checkbox mdl-js-ripple-effect')

    return (
      <label className={classes} ref='wrapper'>
        <input
          disabled={disabled}
          ref='input'
          name={name}
          type='checkbox'
          className='mdl-checkbox__input'
          checked={this.state.checked}
          onChange={this.onChange}
          value={value}/>

        {label
          ? <span className='mdl-checkbox__label'>{label}</span>
          : null}
      </label>
    )
  }
})

export default Checkbox
