import deburr from 'lodash/deburr'
import filter from 'lodash/filter'
import includes from 'lodash/includes'
import lowerCase from 'lodash/toLower'
import map from 'lodash/map'
import trim from 'lodash/trim'
import Message from 'tetris-iso/Message'
import React from 'react'
import Fence from './Fence'
import SubHeader from './SubHeader'
import SearchBox from './HeaderSearchBox'
import {contextualize} from './higher-order/contextualize'
import {Container, ThumbLink} from './ThumbLink'
import {Link} from 'react-router'
import Page from './Page'

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
        <SubHeader>
          <Fence canEditFolder>
            <Link className='mdl-button mdl-color-text--white' to={`/company/${company.id}/workspace/${id}/create/folder`}>
              <i className='material-icons'>add</i>
              <Message>newFolderHeader</Message>
            </Link>
          </Fence>
          <SearchBox onChange={this.onChange}/>
        </SubHeader>
        <Page>
          <Container>
            <h5>
              <Message>folderList</Message>
            </h5>
            {map(matchingFolders, (folder, index) =>
              <Folder key={index} {...folder} workspace={id} company={company.id}/>)}
          </Container>
        </Page>
      </div>
    )
  }
})

export default contextualize(Folders, 'company', 'workspace')
