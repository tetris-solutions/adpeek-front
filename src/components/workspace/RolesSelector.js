import React from 'react'
import PropTypes from 'prop-types'
import map from 'lodash/map'
import Message from 'tetris-iso/Message'
import CheckBox from '../Checkbox'
import includes from 'lodash/includes'
import {routeParamsBasedBranch} from '../higher-order/branch'

export class WorkspaceRolesSelector extends React.Component {
  static displayName = 'Workspace-Roles-Selector'

  static propTypes = {
    company: PropTypes.shape({
      roles: PropTypes.array
    }),
    roles: PropTypes.array
  }

  render () {
    const {company: {roles: allRoles, role: userRole}, roles: selectedRoles} = this.props
    const userRoleId = userRole ? userRole.id : null

    return (
      <fieldset>
        {map(allRoles, ({id, name}, index) => (
          <div className='mdl-grid' key={index}>
            <div className='mdl-cell mdl-cell--4-col'>
              {index === 0 && (
                <Message>rolesLabel</Message>)}
            </div>
            <div className='mdl-cell mdl-cell--8-col'>
              <CheckBox
                name={`role_${id}`}
                label={name}
                disabled={id === userRoleId}
                checked={id === userRoleId || includes(selectedRoles, id)}/>
            </div>
          </div>))}
      </fieldset>
    )
  }
}

export default routeParamsBasedBranch('user', 'company', WorkspaceRolesSelector)
