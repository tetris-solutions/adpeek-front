import React from 'react'

const noop = () => false

export function Button (props) {
  return <button {...props} type='button' onClick={props.disabled ? noop : props.onClick}/>
}

Button.displayName = 'Button'

Button.propTypes = {
  disabled: React.PropTypes.bool,
  onClick: React.PropTypes.func
}

export function Submit (props) {
  return <button type='submit' {...props} />
}

Submit.displayName = 'Submit'
