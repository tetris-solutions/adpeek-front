import React from 'react'
import {ThumbLink, ThumbButton} from './ThumbLink'
import map from 'lodash/map'
import Message from '@tetris/front-server/lib/components/intl/Message'

const {PropTypes} = React

function Folder ({company, workspace, id, name}) {
  return <ThumbLink to={`/company/${company}/workspace/${workspace}/folder/${id}`} title={name}/>
}

Folder.displayName = 'Folder'
Folder.propTypes = {
  id: PropTypes.string,
  workspace: PropTypes.string,
  company: PropTypes.string,
  name: PropTypes.string
}

export const Folders = React.createClass({
  displayName: 'Folders',
  contextTypes: {
    company: PropTypes.object,
    workspace: PropTypes.object
  },
  propTypes: {
    params: PropTypes.shape({
      workspace: PropTypes.string
    })
  },
  render () {
    const {company, workspace: {id, folders}} = this.context
    return (
      <div>
        <div className='mdl-grid'>
          {map(folders, (folder, index) =>
            <Folder key={index} {...folder} workspace={id} company={company.id}/>)}

          <ThumbButton
            title={<Message>newFolderHeader</Message>}
            label={<Message>newFolderCallToAction</Message>}
            to={`/company/${company.id}/workspace/${id}/create/folder`}/>
        </div>
      </div>
    )
  }
})

export default Folders
