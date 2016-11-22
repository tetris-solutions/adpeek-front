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
import {Container, ThumbLink, BottomLine, Cap, Gear} from './ThumbLink'
import {DropdownMenu, MenuItem, HeaderMenuItem} from './DrodownMenu'
import SubHeader, {SubHeaderButton} from './SubHeader'
import Page from './Page'
import {Link} from 'react-router'
import {deleteWorkspaceAction} from '../actions/delete-workspace'
import {loadCompanyWorkspacesAction} from '../actions/load-company-workspaces'
import {unfavoriteWorkspaceAction} from '../actions/unfavorite-workspace'
import {favoriteWorkspaceAction} from '../actions/favorite-workspace'
import DeleteButton from './DeleteButton'
import bind from 'lodash/bind'
import csjs from 'csjs'
import {styled} from './mixins/styled'

const style = csjs`
.sober {
  color: grey;
}
.platform {
  width: 24px;
  height: 24px;
}
.numbers {
  line-height: 24px;
  padding-left: .5em;
}
.label extends .sober {
  padding-left: .5em;
  padding-bottom: .5em;
}
.number extends .sober {
  margin: 0 .8em 0 .3em;
}`
const {PropTypes} = React
const cleanStr = str => trim(deburr(lowerCase(str)))

const DeleteSpan = props => <DeleteButton {...props} tag='span'/>

DeleteSpan.displayName = 'Delete-Span'

const Workspace = ({company, workspace, del, fave, unfave}) => (
  <ThumbLink to={`/company/${company}/workspace/${workspace.id}`} title={workspace.name}>
    <Cap>{workspace.name}</Cap>
    <BottomLine>
      <div className={`${style.label}`}>
        <Message>workspaceFoldersSummary</Message>:
      </div>

      <div className={`${style.numbers}`}>
        <img className={`${style.platform}`} src='/img/g-circle-32.png'/>
        <strong className={`${style.number}`}>
          {Number(workspace.summary.adwords || 0)}
        </strong>

        <img className={`${style.platform}`} src='/img/fb-circle-32.png'/>
        <strong className={`${style.number}`}>
          {Number(workspace.summary.facebook || 0)}
        </strong>
      </div>
    </BottomLine>
    <Gear>
      <DropdownMenu>
        <HeaderMenuItem icon={workspace.favorite ? 'star' : 'star_border'} onClick={workspace.favorite ? unfave : fave}>
          <Message>
            {workspace.favorite ? 'unfaveWorkspace' : 'faveWorkspace'}
          </Message>
        </HeaderMenuItem>
        <MenuItem tag={Link} to={`/company/${company}/workspace/${workspace.id}/edit`} icon='mode_edit'>
          <Message>editWorkspace</Message>
        </MenuItem>
        <MenuItem tag={DeleteSpan} entityName={workspace.name} onClick={del} icon='delete'>
          <Message>deleteWorkspace</Message>
        </MenuItem>
      </DropdownMenu>
    </Gear>
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
  mixins: [styled(style)],
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
            <SubHeaderButton tag={Link} to={`/company/${id}/create/workspace`}>
              <i className='material-icons'>add</i>
              <Message>newWorkspaceHeader</Message>
            </SubHeaderButton>
          </Fence>
          <SearchBox onChange={this.onChange}/>
        </SubHeader>
        <Page>
          <Container>
            {anyFave && (
              <h5>
                <Message>faveWorkspaceList</Message>
              </h5>)}

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
