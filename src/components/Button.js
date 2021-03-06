import React from 'react'
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
      <button {...props} type='submit' disabled>
        ...
      </button>
    )
  }

  return <button {...props} type='submit'/>
}

Submit.displayName = 'Submit'
Submit.contextTypes = {
  submitInProgress: PropTypes.bool
}
