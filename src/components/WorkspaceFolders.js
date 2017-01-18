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
import {Container} from './ThumbLink'
import {Link} from 'react-router'
import Page from './Page'
import FolderCard from './FolderCard'

const cleanStr = str => trim(deburr(lowerCase(str)))

export const Folders = React.createClass({
  displayName: 'Folders',
  propTypes: {
    dispatch: React.PropTypes.func.isRequired,
    params: React.PropTypes.object.isRequired,
    company: React.PropTypes.object,
    workspace: React.PropTypes.object
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
                <FolderCard
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
