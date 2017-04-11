import React from 'react'
import PropTypes from 'prop-types'
import map from 'lodash/map'
import Message from 'tetris-iso/Message'
import CheckBox from './Checkbox'
import includes from 'lodash/includes'
import {node} from './higher-order/branch'

export class WorkspaceRolesSelector extends React.Component {
  static displayName = 'Workspace-Roles-Selector'

  static propTypes = {
    company: PropTypes.shape({
      roles: PropTypes.array
    }),
    roles: PropTypes.array
  }

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
}

export default node('user', 'company', WorkspaceRolesSelector)
