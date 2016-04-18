import React from 'react'
import map from 'lodash/map'
import {Link} from 'react-router'
import Message from '@tetris/front-server/lib/components/intl/Message'

const {PropTypes} = React

function Workspace ({name}) {
  return (
    <div className='mdl-cell mdl-cell--3-coll'>
      <div className='mdl-card mdl-shadow--2dp'>
        <div className='mdl-card__title mdl-card--expand'>
          <h3 className='mdl-card__title-text'>{name}</h3>
        </div>
      </div>
    </div>
  )
}

Workspace.displayName = 'Workspace'
Workspace.propTypes = {
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
            <Workspace key={index} {...workspace} />)}

          <div className='mdl-cell mdl-cell--3-coll'>
            <div className='mdl-card mdl-shadow--2dp'>
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

export default Workspaces
