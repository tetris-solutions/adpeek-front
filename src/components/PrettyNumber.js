import React from 'react'
import PropTypes from 'prop-types'
import {prettyNumber} from '../functions/pretty-number'

const PrettyNumber = ({children: value, type}, {locales}) =>
  <span>{prettyNumber(value, type, locales)}</span>

PrettyNumber.displayName = 'Pretty-Number'
PrettyNumber.propTypes = {
  children: PropTypes.number.isRequired,
  type: PropTypes.string
}
PrettyNumber.contextTypes = {
  locales: PropTypes.string
}

export default PrettyNumber
