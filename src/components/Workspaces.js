import React from 'react'
import map from 'lodash/map'
import {ThumbLink, ThumbButton} from './ThumbLink'
import Message from '@tetris/front-server/lib/components/intl/Message'
import {contextualize} from './higher-order/contextualize'

const {PropTypes} = React

function Workspace ({company, id, name}) {
  return <ThumbLink to={`/company/${company}/workspace/${id}`} title={name}/>
}

Workspace.displayName = 'Workspace'
Workspace.propTypes = {
  id: PropTypes.string,
  company: PropTypes.string,
  name: PropTypes.string
}

export const Workspaces = React.createClass({
  displayName: 'Workspaces',
  propTypes: {
    company: PropTypes.shape({
      workspaces: PropTypes.array
    })
  },
  render () {
    const {company: {id, workspaces}} = this.props
    return (
      <div>
        <div className='mdl-grid'>
          {map(workspaces, (workspace, index) =>
            <Workspace key={index} {...workspace} company={id}/>)}

          <ThumbButton
            title={<Message>newWorkspaceHeader</Message>}
            label={<Message>newWorkspaceCallToAction</Message>}
            to={`/company/${id}/create/workspace`}/>
        </div>
      </div>
    )
  }
})

export default contextualize(Workspaces, 'company')
