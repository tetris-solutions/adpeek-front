import React from 'react'
import map from 'lodash/map'
import {Link} from 'react-router'
import Message from '@tetris/front-server/lib/components/intl/Message'

const {PropTypes} = React

function Folder ({company, workspace, id, name}) {
  return (
    <Link to={`/company/${company}/workspace/${workspace}/folder/${id}`} className='mdl-cell mdl-cell--2-col'>
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

          <div className='mdl-cell mdl-cell--2-col'>
            <div className='mdl-card mdl-shadow--2dp ContainedCard'>
              <div className='mdl-card__title mdl-card--expand'>
                <h3 className='mdl-card__title-text'>
                  <Message>newFolderHeader</Message>
                </h3>
              </div>
              <div className='mdl-card__actions mdl-card--border'>
                <Link
                  className='mdl-button mdl-button--colored'
                  to={`/company/${company.id}/workspace/${id}/create/folder`}>
                  <Message>newFolderCallToAction</Message>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }
})

export default Folders
