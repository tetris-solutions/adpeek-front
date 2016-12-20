import deburr from 'lodash/deburr'
import filter from 'lodash/filter'
import includes from 'lodash/includes'
import lowerCase from 'lodash/toLower'
import map from 'lodash/map'
import trim from 'lodash/trim'
import Message from 'tetris-iso/Message'
import React from 'react'
import Fence from './Fence'
import SubHeader, {SubHeaderButton} from './SubHeader'
import SearchBox from './HeaderSearchBox'
import {contextualize} from './higher-order/contextualize'
import {Container, ThumbLink, Title, Gear} from './ThumbLink'
import {DropdownMenu, MenuItem} from './DrodownMenu'
import {Link} from 'react-router'
import {deleteFolderAction} from '../actions/delete-folder'
import Page from './Page'
import DeleteButton from './DeleteButton'

const cleanStr = str => trim(deburr(lowerCase(str)))

const {PropTypes} = React

const DeleteFolder = ({params, dispatch, id, name}) => (
  <MenuItem
    icon='delete'
    tag={props => <DeleteButton {...props} tag='span'/>}
    onClick={() => dispatch(deleteFolderAction, params, id)}
    entityName={name}>
    <Message>deleteFolder</Message>
  </MenuItem>
)
DeleteFolder.displayName = 'Delete-Folder'
DeleteFolder.propTypes = {
  id: PropTypes.string.isRequired,
  name: PropTypes.string.isRequired,
  params: PropTypes.object.isRequired,
  dispatch: PropTypes.func.isRequired
}

const Folder = ({id, name, editable, dispatch, params}) => {
  const {company, workspace} = params
  const folderUrl = `/company/${company}/workspace/${workspace}/folder/${id}`

  return (
    <ThumbLink to={folderUrl} title={name}>
      <Title>{name}</Title>
      <Gear>
        <DropdownMenu>
          {editable &&
          <MenuItem to={`${folderUrl}/edit`} tag={Link} icon='mode_edit'>
            <Message>editFolder</Message>
          </MenuItem>}

          {editable &&
          <DeleteFolder
            id={id}
            name={name}
            params={params}
            dispatch={dispatch}/>}

        </DropdownMenu>
      </Gear>
    </ThumbLink>
  )
}

Folder.displayName = 'Folder'
Folder.propTypes = {
  id: PropTypes.string.isRequired,
  name: PropTypes.string.isRequired,
  editable: PropTypes.bool.isRequired,
  dispatch: PropTypes.func.isRequired,
  params: PropTypes.object.isRequired
}

export const Folders = React.createClass({
  displayName: 'Folders',
  propTypes: {
    dispatch: PropTypes.func.isRequired,
    params: PropTypes.object.isRequired,
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
    const {dispatch, params, company, workspace: {id, folders}} = this.props

    const matchingFolders = searchValue
      ? filter(folders, ({name}) => includes(cleanStr(name), searchValue))
      : folders

    return (
      <Fence canEditFolder>{({canEditFolder}) =>
        <div>
          <SubHeader>
            {canEditFolder && (
              <SubHeaderButton tag={Link} to={`/company/${company.id}/workspace/${id}/create/folder`}>
                <i className='material-icons'>add</i>
                <Message>newFolderHeader</Message>
              </SubHeaderButton>)}
            <SearchBox onChange={this.onChange}/>
          </SubHeader>
          <Page>
            <Container>
              <h5>
                <Message>folderList</Message>
              </h5>
              {map(matchingFolders, (folder, index) =>
                <Folder
                  key={index}
                  {...folder}
                  dispatch={dispatch}
                  params={params}
                  editable={canEditFolder}/>)}
            </Container>
          </Page>
        </div>}
      </Fence>
    )
  }
})

export default contextualize(Folders, 'company', 'workspace')
