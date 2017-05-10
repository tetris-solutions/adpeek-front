import React from 'react'
import PropTypes from 'prop-types'
import {SubText} from '../Utils'
import camelCase from 'lodash/camelCase'

function OptimizationStatus ({status}, {messages}) {
  const labelName = camelCase(status) + 'StatusLabel'

  return (
    <SubText>
      {messages[labelName] ? messages[labelName] : status}
    </SubText>
  )
}

OptimizationStatus.displayName = 'Optimization-Status'
OptimizationStatus.propTypes = {
  status: PropTypes.oneOf([
    'OPTIMIZE',
    'CONVERSION_OPTIMIZE',
    'ROTATE',
    'ROTATE_INDEFINITELY',
    'UNAVAILABLE',
    'UNKNOWN'
  ])
}
OptimizationStatus.contextTypes = {
  messages: PropTypes.object
}

export default OptimizationStatus
