import deburr from 'lodash/deburr'
import orderBy from 'lodash/orderBy'
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
import {collection} from './higher-order/branch'
import {Container} from './ThumbLink'
import {Link} from 'react-router'
import Page from './Page'
import FolderCard from './FolderCard'

const cleanStr = str => trim(deburr(lowerCase(str)))

const Cards = ({editable, folders}) => (
  <Container>
    <h5>
      <Message>folderList</Message>
    </h5>
    {map(folders, ({id}, index) =>
      <FolderCard
        key={index}
        params={{folder: id}}
        editable={editable}/>)}
  </Container>
)

Cards.displayName = 'Cards'
Cards.propTypes = {
  editable: React.PropTypes.bool,
  folders: React.PropTypes.array
}

let List = ({editable, searchValue, folders}) => (
  <Cards
    editable={editable}
    folders={orderBy(searchValue
      ? filter(folders, ({name}) => includes(cleanStr(name), searchValue))
      : folders, ['creation'], ['desc']
    )}/>
)

List.displayName = 'List'
List.propTypes = {
  editable: React.PropTypes.bool,
  searchValue: React.PropTypes.string,
  folders: React.PropTypes.array
}
List = collection('workspace', 'folders', List)

export const Folders = React.createClass({
  displayName: 'Folders',
  propTypes: {
    params: React.PropTypes.shape({
      company: React.PropTypes.string,
      workspace: React.PropTypes.string
    }).isRequired
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
    const {params: {company, workspace}} = this.props

    return (
      <Fence canEditFolder>{({canEditFolder}) =>
        <div>
          <SubHeader>
            {canEditFolder && (
              <SubHeaderButton tag={Link} to={`/company/${company}/workspace/${workspace}/create/folder`}>
                <i className='material-icons'>add</i>
                <Message>newFolderHeader</Message>
              </SubHeaderButton>)}
            <SearchBox onChange={this.onChange}/>
          </SubHeader>
          <Page>
            <List
              searchValue={searchValue}
              editable={canEditFolder}/>
          </Page>
        </div>}
      </Fence>
    )
  }
})

export default Folders
