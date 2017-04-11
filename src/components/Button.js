import React from 'react'

import PropTypes from 'prop-types'

const noop = () => false

export function Button (props) {
  return <button {...props} type='button' onClick={props.disabled ? noop : props.onClick}/>
}

Button.displayName = 'Button'

Button.propTypes = {
  disabled: PropTypes.bool,
  onClick: PropTypes.func
}

export function Submit (props) {
  return <button {...props} type='submit'/>
}

Submit.displayName = 'Submit'
