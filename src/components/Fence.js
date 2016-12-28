import React from 'react'
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
  isRegularUser: 'isRegularUser',
  isAdmin: 'isAdmin',
  isLoggedIn: 'isLoggedIn'
}
const permissionAliases = invert(permissionNames)
const getPermissionName = id => permissionNames[id]
const none = []
const passengerType = React.PropTypes.oneOfType([
  React.PropTypes.func,
  React.PropTypes.node
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
  permissions: React.PropTypes.shape({
    allow: React.PropTypes.bool.isRequired,
    granted: React.PropTypes.array.isRequired,
    required: React.PropTypes.array.isRequired
  }).isRequired
}

const Fence = React.createClass({
  displayName: 'Fence',
  contextTypes: {
    company: React.PropTypes.object.isRequired,
    isGuest: React.PropTypes.bool.isRequired,
    isAdmin: React.PropTypes.bool.isRequired
  },
  propTypes: {
    children: passengerType,
    canEditWorkspace: React.PropTypes.bool,
    canEditFolder: React.PropTypes.bool,
    canEditCampaign: React.PropTypes.bool,
    canEditOrder: React.PropTypes.bool,
    canEditReport: React.PropTypes.bool,
    canBrowseReports: React.PropTypes.bool,
    isLoggedIn: React.PropTypes.bool,
    isRegularUser: React.PropTypes.bool,
    isAdmin: React.PropTypes.bool
  },
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
})

export default Fence
