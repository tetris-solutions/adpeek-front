import deburr from 'lodash/deburr'
import filter from 'lodash/filter'
import groupBy from 'lodash/groupBy'
import includes from 'lodash/includes'
import lowerCase from 'lodash/toLower'
import map from 'lodash/map'
import trim from 'lodash/trim'
import Message from 'tetris-iso/Message'
import React from 'react'
import Fence from './Fence'
import SearchBox from './HeaderSearchBox'
import {contextualize} from './higher-order/contextualize'
import {Container, ThumbLink, Cap, Menu, HeaderMenuItem, MenuItem} from './ThumbLink'
import SubHeader from './SubHeader'
import Page from './Page'
import {Link} from 'react-router'
import {deleteWorkspaceAction} from '../actions/delete-workspace'
import {loadCompanyWorkspacesAction} from '../actions/load-company-workspaces'
import {unfavoriteWorkspaceAction} from '../actions/unfavorite-workspace'
import {favoriteWorkspaceAction} from '../actions/favorite-workspace'
import DeleteButton from './DeleteButton'
import bind from 'lodash/bind'

const {PropTypes} = React
const cleanStr = str => trim(deburr(lowerCase(str)))

const Workspace = ({company, workspace, del, fave, unfave}) => (
  <ThumbLink to={`/company/${company}/workspace/${workspace.id}`} title={workspace.name}>
    <Cap>{workspace.name}</Cap>
    <Menu>
      <HeaderMenuItem icon={workspace.favorite ? 'star' : 'star_border'} onClick={workspace.favorite ? unfave : fave}>
        <Message>
          {workspace.favorite ? 'unfaveWorkspace' : 'faveWorkspace'}
        </Message>
      </HeaderMenuItem>
      <MenuItem tag={Link} to={`/company/${company}/workspace/${workspace.id}/edit`} icon='mode_edit'>
        <Message>editWorkspace</Message>
      </MenuItem>
      <MenuItem tag={DeleteButton} span entityName={workspace.name} onClick={del} icon='delete'>
        <Message>deleteWorkspace</Message>
      </MenuItem>
    </Menu>
  </ThumbLink>
)
Workspace.displayName = 'Workspace'
Workspace.propTypes = {
  company: PropTypes.string,
  workspace: PropTypes.object,
  del: PropTypes.func.isRequired,
  fave: PropTypes.func.isRequired,
  unfave: PropTypes.func.isRequired
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
  workspaceAction (id, action) {
    const {dispatch, company} = this.props
    const reloadWorkspaces = () => dispatch(loadCompanyWorkspacesAction, company.id)

    dispatch(action, id).then(reloadWorkspaces)
  },
  deleteWorkspace (id) {
    this.workspaceAction(id, deleteWorkspaceAction)
  },
  favoriteWorkspace (id) {
    this.workspaceAction(id, favoriteWorkspaceAction)
  },
  unfavoriteWorkspace (id) {
    this.workspaceAction(id, unfavoriteWorkspaceAction)
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

    const groupedByFaveStatus = groupBy(matchingWorkspaces, ({favorite}) => Boolean(favorite))
    const anyFave = Boolean(groupedByFaveStatus.true)
    const anyNormie = Boolean(groupedByFaveStatus.false)

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
            {anyFave && <h5><Message>faveWorkspaceList</Message></h5>}

            {map(groupedByFaveStatus.true, (workspace, index) =>
              <Workspace
                fave={bind(this.favoriteWorkspace, null, workspace.id)}
                unfave={bind(this.unfavoriteWorkspace, null, workspace.id)}
                del={bind(this.deleteWorkspace, null, workspace.id)}
                key={workspace.id}
                company={id}
                workspace={workspace}/>)}

            {anyFave && <br/>}
            {anyFave && <br/>}

            {anyNormie && <h5><Message>workspaceList</Message></h5>}
            {map(groupedByFaveStatus.false, (workspace, index) =>
              <Workspace
                fave={bind(this.favoriteWorkspace, null, workspace.id)}
                unfave={bind(this.unfavoriteWorkspace, null, workspace.id)}
                del={bind(this.deleteWorkspace, null, workspace.id)}
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
