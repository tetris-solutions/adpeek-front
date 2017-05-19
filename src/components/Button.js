import React from 'react'
import Message from 'tetris-iso/Message'
import noop from 'lodash/noop'
import PropTypes from 'prop-types'

export function Button (props) {
  return <button {...props} type='button' onClick={props.disabled ? noop : props.onClick}/>
}

Button.displayName = 'Button'

Button.propTypes = {
  disabled: PropTypes.bool,
  onClick: PropTypes.func
}

export function Submit (props, {submitInProgress}) {
  if (submitInProgress) {
    return (
      <button type='submit' className={props.className} disabled>
        <Message>submitInProgress</Message>
      </button>
    )
  }

  return <button {...props} type='submit'/>
}

Submit.displayName = 'Submit'
Submit.propTypes = {
  className: PropTypes.string
}
Submit.contextTypes = {
  submitInProgress: PropTypes.bool
}
