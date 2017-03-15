import React from 'react'
import map from 'lodash/map'
import Message from 'tetris-iso/Message'
import CheckBox from './Checkbox'
import includes from 'lodash/includes'
import {node} from './higher-order/branch'

export const WorkspaceRolesSelector = React.createClass({
  displayName: 'Workspace-Roles-Selector',
  propTypes: {
    company: React.PropTypes.shape({
      roles: React.PropTypes.array
    }),
    roles: React.PropTypes.array
  },
  render () {
    const {company: {roles: allRoles, role: {id: myRole}}, roles: selectedRoles} = this.props

    return (
      <fieldset>
        {map(allRoles, ({id, name}, index) => (
          <div className='mdl-grid' key={index}>
            <div className='mdl-cell mdl-cell--4-col'>
              {index === 0 && (
                <Message>rolesLabel</Message>
              )}
            </div>
            <div className='mdl-cell mdl-cell--8-col'>
              <CheckBox
                name={`role_${id}`}
                label={name}
                disabled={id === myRole}
                checked={id === myRole || includes(selectedRoles, id)}/>
            </div>
          </div>
        ))}
      </fieldset>
    )
  }
})

export default node('user', 'company', WorkspaceRolesSelector)
