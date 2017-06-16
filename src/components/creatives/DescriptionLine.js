import React from 'react'
import PropTypes from 'prop-types'
import CleanInput from './CleanInput'
import isString from 'lodash/isString'
import omit from 'lodash/omit'

function DescriptionLine (props) {
  if (!isString(props.value)) return null

  if (props.editMode) {
    return (
      <div>
        <CleanInput
          {...omit(props, 'editMode')}
          style={props.multiline ? undefined : {width: '100%'}}/>
      </div>
    )
  }

  return (
    <div>
      {props.value}
    </div>
  )
}

DescriptionLine.displayName = 'Description-Line'
DescriptionLine.defaultProps = {
  multiline: false
}
DescriptionLine.propTypes = {
  multiline: PropTypes.bool,
  editMode: PropTypes.bool.isRequired,
  onChange: PropTypes.func.isRequired,
  value: PropTypes.string,
  name: PropTypes.string.isRequired,
  placeholder: PropTypes.string.isRequired
}

export default DescriptionLine
