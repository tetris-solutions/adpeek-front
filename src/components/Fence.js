import React from 'react'
import PropTypes from 'prop-types'
import diff from 'lodash/difference'
import get from 'lodash/get'
import isEmpty from 'lodash/isEmpty'
import map from 'lodash/map'
import isFunction from 'lodash/isFunction'
import includes from 'lodash/includes'
import keys from 'lodash/keys'
import invert from 'lodash/invert'
import compact from 'lodash/compact'

const permissionNames = {
  canEditWorkspace: 'APEditWorkspaces',
  canEditFolder: 'APEditFolders',
  canEditCampaign: 'APEditCampaigns',
  canEditOrder: 'APEditOrders',
  canEditReport: 'APEditReports',
  canBrowseReports: 'APBrowseReports',
  canConfigShopping: 'APShoppingSetup',
  isRegularUser: 'isRegularUser',
  isAdmin: 'isAdmin',
  isLoggedIn: 'isLoggedIn'
}
const permissionAliases = invert(permissionNames)
const getPermissionName = id => permissionNames[id]
const none = []
const passengerType = PropTypes.oneOfType([
  PropTypes.func,
  PropTypes.node
]).isRequired

function Gate ({passenger, permissions}) {
  if (isFunction(passenger)) {
    return passenger(permissions)
  }

  return permissions.allow
    ? passenger
    : null
}

Gate.displayName = 'Gate'
Gate.propTypes = {
  passenger: passengerType,
  permissions: PropTypes.shape({
    allow: PropTypes.bool.isRequired,
    granted: PropTypes.array.isRequired,
    required: PropTypes.array.isRequired
  }).isRequired
}

class Fence extends React.Component {
  static displayName = 'Fence'

  static contextTypes = {
    company: PropTypes.object.isRequired,
    isGuest: PropTypes.bool.isRequired,
    isAdmin: PropTypes.bool.isRequired
  }

  static propTypes = {
    children: passengerType,
    canEditWorkspace: PropTypes.bool,
    canEditFolder: PropTypes.bool,
    canEditCampaign: PropTypes.bool,
    canEditOrder: PropTypes.bool,
    canEditReport: PropTypes.bool,
    canConfigShopping: PropTypes.bool,
    canBrowseReports: PropTypes.bool,
    isLoggedIn: PropTypes.bool,
    isRegularUser: PropTypes.bool,
    isAdmin: PropTypes.bool
  }

  render () {
    const {props, context} = this
    const required = compact(map(keys(props), getPermissionName))
    const granted = map(get(context, ['company', 'permissions'], none), 'id')

    if (!context.isGuest) {
      granted.push(permissionNames.isRegularUser)
    }

    if (context.isAdmin) {
      granted.push(permissionNames.isAdmin)
    }

    if (context.isLoggedIn) {
      granted.push(permissionNames.isLoggedIn)
    }

    const missing = diff(required, granted)
    const allow = isEmpty(missing)
    const permissions = {allow, missing, granted, required}

    for (let i = 0; i < required.length; i++) {
      const name = required[i]
      const alias = permissionAliases[name]

      permissions[alias] = includes(granted, name)
    }

    return <Gate passenger={props.children} permissions={permissions}/>
  }
}

export default Fence
