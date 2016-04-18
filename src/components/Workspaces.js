import React from 'react'
import map from 'lodash/map'

const {PropTypes} = React

export const Workspaces = React.createClass({
  displayName: 'Workspaces',
  contextTypes: {
    company: PropTypes.shape({
      workspaces: PropTypes.array
    })
  },
  render () {
    const {company: {workspaces}} = this.context
    return (
      <ul>
        {map(workspaces,
          ({name}, index) => <li key={index}>{name}</li>)}
      </ul>
    )
  }
})

export default Workspaces
