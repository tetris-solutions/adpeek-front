import React from 'react'
import {contextualize} from './higher-order/contextualize'
import diff from 'lodash/difference'
import get from 'lodash/get'
import isEmpty from 'lodash/isEmpty'

const {PropTypes} = React

function Fence (props) {
  const requiredPermissions = []

  for (const key in props) {
    if (props.hasOwnProperty(key)) {
      if (props[key] === true) {
        requiredPermissions.push(key)
      }
    }
  }

  const allowed = isEmpty(diff(requiredPermissions, get(props, ['company', 'permissions'])))

  return props.children({allowed})
}

Fence.displayName = 'Fence'
Fence.propTypes = {
  children: PropTypes.func.isRequired,
  company: PropTypes.shape({
    permissions: PropTypes.array
  })
}

export default contextualize(Fence, 'company')
