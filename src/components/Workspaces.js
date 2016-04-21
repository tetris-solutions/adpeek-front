import React from 'react'
import map from 'lodash/map'
import {Link} from 'react-router'
import Message from '@tetris/front-server/lib/components/intl/Message'

const {PropTypes} = React

function Workspace ({company, id, name}) {
  return (
    <Link to={`/company/${company}/workspace/${id}`} className='mdl-cell mdl-cell--2-col'>
      <div className='mdl-card mdl-shadow--2dp ContainedCard'>
        <div className='mdl-card__title mdl-card--expand'>
          <h3 className='mdl-card__title-text'>
            {name}
          </h3>
        </div>
      </div>
    </Link>
  )
}

Workspace.displayName = 'Workspace'
Workspace.propTypes = {
  id: PropTypes.string,
  company: PropTypes.string,
  name: PropTypes.string
}

export const Workspaces = React.createClass({
  displayName: 'Workspaces',
  contextTypes: {
    company: PropTypes.shape({
      workspaces: PropTypes.array
    })
  },
  render () {
    const {company: {id, workspaces}} = this.context
    return (
      <div>
        <div className='mdl-grid'>
          {map(workspaces, (workspace, index) =>
            <Workspace key={index} {...workspace} company={id}/>)}

          <div className='mdl-cell mdl-cell--2-col'>
            <div className='mdl-card mdl-shadow--2dp ContainedCard'>
              <div className='mdl-card__title mdl-card--expand'>
                <h3 className='mdl-card__title-text'>
                  <Message>newWorkspaceHeader</Message>
                </h3>
              </div>
              <div className='mdl-card__actions mdl-card--border'>
                <Link
                  className='mdl-button mdl-button--colored mdl-js-button mdl-js-ripple-effect'
                  to={`/company/${id}/create/workspace`}>
                  <Message>newWorkspaceCallToAction</Message>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }
})

export function Breadcrumb ({params: {company}}, {workspace: {id, name}}) {
  return (
    <Link to={`/company/${company}/workspace/${id}`}>
      {name}
    </Link>
  )
}

Breadcrumb.displayName = 'Workspace-Breadcrumb'
Breadcrumb.contextTypes = {
  workspace: PropTypes.shape({
    id: PropTypes.string,
    name: PropTypes.string
  })
}
Breadcrumb.propTypes = {
  params: PropTypes.shape({
    company: PropTypes.string
  })
}

export default Workspaces
