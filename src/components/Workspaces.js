import deburr from 'lodash/deburr'
import filter from 'lodash/filter'
import includes from 'lodash/includes'
import lowerCase from 'lodash/toLower'
import map from 'lodash/map'
import trim from 'lodash/trim'
import Message from 'tetris-iso/Message'
import React from 'react'
import Fence from './Fence'
import SearchBox from './HeaderSearchBox'
import {contextualize} from './higher-order/contextualize'
import {Container, Title, ThumbLink, Menu, MenuItem} from './ThumbLink'
import SubHeader from './SubHeader'
import Page from './Page'
import {Link} from 'react-router'
import {deleteWorkspaceAction} from '../actions/delete-workspace'
import {loadCompanyWorkspacesAction} from '../actions/load-company-workspaces'
import DeleteButton from './DeleteButton'

const {PropTypes} = React
const cleanStr = str => trim(deburr(lowerCase(str)))

function Workspace ({company, workspace, deleteWorkspace}) {
  function onClick () {
    deleteWorkspace(workspace.id)
  }

  return (
    <ThumbLink to={`/company/${company}/workspace/${workspace.id}`} title={workspace.name}>
      <Title>{workspace.name}</Title>
      <Menu>
        <MenuItem tag={Link} to={`/company/${company}/workspace/${workspace.id}/edit`} icon='mode_edit'>
          <Message>editWorkspace</Message>
        </MenuItem>
        <MenuItem tag={DeleteButton} span entityName={workspace.name} onClick={onClick} icon='delete'>
          <Message>deleteWorkspace</Message>
        </MenuItem>
      </Menu>
    </ThumbLink>
  )
}
Workspace.displayName = 'Workspace'
Workspace.propTypes = {
  company: PropTypes.string,
  workspace: PropTypes.object,
  deleteWorkspace: PropTypes.func.isRequired
}
Workspace.contextTypes = {
  router: PropTypes.object
}

export const Workspaces = React.createClass({
  displayName: 'Workspaces',
  propTypes: {
    dispatch: PropTypes.func,
    company: PropTypes.shape({
      workspaces: PropTypes.array
    })
  },
  contextTypes: {
    router: PropTypes.object
  },
  getInitialState () {
    return {
      searchValue: ''
    }
  },
  deleteWorkspace (id) {
    const {dispatch, company} = this.props

    dispatch(deleteWorkspaceAction, id)
      .then(() => dispatch(loadCompanyWorkspacesAction, company.id))
  },
  onChange (searchValue) {
    this.setState({searchValue})
  },
  render () {
    const searchValue = cleanStr(this.state.searchValue)
    const {company: {id, workspaces}} = this.props
    const matchingWorkspaces = searchValue
      ? filter(workspaces, ({name}) => includes(cleanStr(name), searchValue))
      : workspaces

    return (
      <div>
        <SubHeader>
          <Fence canEditWorkspace>
            <Link className='mdl-button mdl-color-text--white' to={`/company/${id}/create/workspace`}>
              <i className='material-icons'>add</i>
              <Message>newWorkspaceHeader</Message>
            </Link>
          </Fence>
          <SearchBox onChange={this.onChange}/>

        </SubHeader>
        <Page>
          <Container>
            <h5>
              <Message>workspaceList</Message>
            </h5>
            {map(matchingWorkspaces, (workspace, index) =>
              <Workspace
                deleteWorkspace={this.deleteWorkspace}
                key={workspace.id}
                company={id}
                workspace={workspace}/>)}
          </Container>
        </Page>
      </div>
    )
  }
})

export default contextualize(Workspaces, 'company')
