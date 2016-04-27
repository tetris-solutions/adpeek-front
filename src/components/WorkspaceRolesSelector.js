import React from 'react'
import map from 'lodash/map'
import CheckBox from './Checkbox'
import includes from 'lodash/includes'

const {PropTypes} = React

export const WorkspaceRolesSelector = React.createClass({
  displayName: 'Workspace-Roles-Selector',
  contextTypes: {
    company: PropTypes.shape({
      roles: PropTypes.array
    })
  },
  propTypes: {
    roles: PropTypes.array
  },
  render () {
    const selectedRoles = this.props.roles
    return (
      <fieldset>
        {map(this.context.company.roles, ({id, name}, index) => (
          <div className='mdl-grid' key={index}>
            <div className='mdl-cell mdl-cell--4-col'>
              {index === 0 && 'Grupos:'}
            </div>
            <div className='mdl-cell mdl-cell--8-col'>
              <CheckBox name={`role_${id}`} label={name} checked={includes(selectedRoles, id)} />
            </div>
          </div>
        ))}
      </fieldset>
    )
  }
})

export default WorkspaceRolesSelector
