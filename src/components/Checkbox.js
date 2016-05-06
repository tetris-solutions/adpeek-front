import React from 'react'
import cx from 'classnames'
import window from 'global/window'

const {PropTypes} = React
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
    checked: PropTypes.bool,
    name: PropTypes.string.isRequired,
    label: PropTypes.string,
    value: PropTypes.string
  },
  getDefaultProps () {
    return {
      value: 'on'
    }
  },
  getInitialState () {
    return {
      checked: this.props.checked
    }
  },
  componentDidMount () {
    const {input, wrapper} = this.refs

    input.programaticallyCheck = () => {
      input.parentNode.MaterialCheckbox.check()
      this.setState({checked: true})
    }

    input.programaticallyUncheck = () => {
      input.parentNode.MaterialCheckbox.uncheck()
      this.setState({checked: false})
    }

    window.componentHandler.upgradeElement(wrapper)
  },
  onChange ({target, nativeEvent: {shiftKey, ctrlKey}}) {
    this.setState({checked: target.checked}, () => {
      if (!target.form) return

      if (shiftKey || ctrlKey) {
        checkBetween(target.form._lastChecked, target)
      }

      target.form._lastChecked = target
    })
  },
  render () {
    const {label, name, value} = this.props
    const classes = cx('mdl-checkbox',
      isBrowser && 'mdl-js-checkbox mdl-js-ripple-effect')

    return (
      <label className={classes} ref='wrapper'>
        <input
          ref='input'
          name={name}
          type='checkbox'
          className='mdl-checkbox__input'
          checked={this.state.checked}
          onChange={this.onChange}
          value={value}/>

        {label ? (
          <span className='mdl-checkbox__label'>
            {label}
          </span>) : null}
      </label>
    )
  }
})

export default Checkbox
