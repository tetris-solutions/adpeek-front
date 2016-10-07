import deburr from 'lodash/deburr'
import filter from 'lodash/filter'
import includes from 'lodash/includes'
import lowerCase from 'lodash/toLower'
import map from 'lodash/map'
import trim from 'lodash/trim'
import Message from '@tetris/front-server/lib/components/intl/Message'
import React from 'react'
import Fence from './Fence'

import SearchBox from './HeaderSearchBox'
import {contextualize} from './higher-order/contextualize'
import {ThumbLink, ThumbButton} from './ThumbLink'

const cleanStr = str => trim(deburr(lowerCase(str)))

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
  propTypes: {
    params: PropTypes.shape({
      workspace: PropTypes.string
    }),
    company: PropTypes.object,
    workspace: PropTypes.object
  },
  getInitialState () {
    return {
      searchValue: ''
    }
  },
  onChange (searchValue) {
    this.setState({searchValue})
  },
  render () {
    const searchValue = cleanStr(this.state.searchValue)
    const {company, workspace: {id, folders}} = this.props
    const matchingFolders = searchValue
      ? filter(folders, ({name}) => includes(cleanStr(name), searchValue))
      : folders

    return (
      <div>
        <header className='mdl-layout__header'>
          <div className='mdl-layout__header-row mdl-color--blue-grey-500'>
            <Message>folderList</Message>
            <div className='mdl-layout-spacer'/>
            <SearchBox onChange={this.onChange}/>
          </div>
        </header>
        <div className='mdl-grid'>
          {map(matchingFolders, (folder, index) =>
            <Folder key={index} {...folder} workspace={id} company={company.id}/>)}

          <Fence APEditFolders>
            <ThumbButton
              title={<Message>newFolderHeader</Message>}
              label={<Message>newFolderCallToAction</Message>}
              to={`/company/${company.id}/workspace/${id}/create/folder`}/>
          </Fence>
        </div>
      </div>
    )
  }
})

export default contextualize(Folders, 'company', 'workspace')
