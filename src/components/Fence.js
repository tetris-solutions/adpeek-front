import React from 'react'
import {contextualize} from './higher-order/contextualize'
import diff from 'lodash/difference'
import get from 'lodash/get'
import isEmpty from 'lodash/isEmpty'
import map from 'lodash/map'

const {PropTypes} = React
const none = []

function Fence (props) {
  const required = []

  for (const key in props) {
    if (props.hasOwnProperty(key) && props[key] === true) {
      required.push(key)
    }
  }

  const granted = map(get(props, ['company', 'permissions'], none), 'id')
  const missing = diff(required, granted)
  const allow = isEmpty(missing)

  return props.children({allow, missing, granted, required})
}

Fence.displayName = 'Fence'
Fence.propTypes = {
  children: PropTypes.func.isRequired,
  company: PropTypes.shape({
    permissions: PropTypes.array
  })
}

export default contextualize(Fence, 'company')
