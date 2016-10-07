import React from 'react'
import diff from 'lodash/difference'
import get from 'lodash/get'
import isEmpty from 'lodash/isEmpty'
import map from 'lodash/map'

const {PropTypes} = React
const none = []

const Gate = ({passenger, permissions}) => passenger(permissions)

Gate.displayName = 'Gate'
Gate.propTypes = {
  passenger: PropTypes.func.isRequired,
  permissions: PropTypes.shape({
    allow: PropTypes.bool.isRequired,
    granted: PropTypes.array.isRequired,
    required: PropTypes.array.isRequired
  }).isRequired
}

function Fence (props, context) {
  const required = []

  for (const key in props) {
    if (props.hasOwnProperty(key) && props[key] === true) {
      required.push(key)
    }
  }

  const granted = map(get(context, ['company', 'permissions'], none), 'id')
  const missing = diff(required, granted)
  const allow = isEmpty(missing)
  const permissions = {allow, missing, granted, required}

  return <Gate passenger={props.children} permissions={permissions}/>
}

Fence.displayName = 'Fence'
Fence.propTypes = {
  children: PropTypes.func.isRequired
}
Fence.contextTypes = {
  company: PropTypes.object.isRequired
}

export default Fence
