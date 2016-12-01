import deburr from 'lodash/deburr'
import filter from 'lodash/filter'
import forEach from 'lodash/forEach'
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
import {loadWorkspaceStatsAction} from '../actions/load-workspace-stats'
import DeleteButton from './DeleteButton'
import bind from 'lodash/bind'
import csjs from 'csjs'
import {styled} from './mixins/styled'
import {prettyNumber} from '../functions/pretty-number'

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
}
.rail {
  background-color: grey;
  overflow: hidden;
  border-radius: 3px;
  padding: 2px;
  margin-bottom: 1em;
}
.rail > div {
  border-radius: 3px;
  height: 4px;
}
.statsWrap {
  padding: 1em 0 5em .7em;
}
.stats {
  padding: 0 1em 0 .5em;
}
.numbers {
  display: block;
  text-overflow: ellipsis;
  overflow: hidden;
  white-space: nowrap;
  font-size: small;
}
.numbers > strong {
  font-size: 105%;
}`
const {PropTypes} = React
const cleanStr = str => trim(deburr(lowerCase(str)))

const DeleteSpan = props => <DeleteButton {...props} tag='span'/>

DeleteSpan.displayName = 'Delete-Span'

const num = val => val === null ? 0 : val
const ratio = (a, b) => b === 0 ? 0 : a / b

const Stats = ({open, yesterday}, {locales}) => (
  <div className={`${style.statsWrap}`}>
    <div className={`${style.label}`}>
      <Message>investmentLabel</Message>:
    </div>
    <div className={`${style.stats}`}>
      <div className={`${style.numbers}`}>
        <strong>
          {open.cost === null ? '--' : prettyNumber(open.cost, 'currency', locales)}
        </strong>
        <span className='mdl-color-text--grey-600'>
          {' / '}
          {open.budget === null ? '--' : prettyNumber(open.budget, 'currency', locales)}
        </span>
      </div>
      <div className={`mdl-color--grey-300 ${style.rail}`}>
        <div
          style={{width: Math.min(100, Math.floor(100 * ratio(num(open.cost), num(open.budget)))) + '%'}}
          className={num(open.cost) > num(open.budget)
            ? 'mdl-color--red-800'
            : 'mdl-color--primary'}/>
      </div>
    </div>
  </div>
)
Stats.displayName = 'Stats'
Stats.defaultProps = {
  open: {
    budget: null,
    cost: null
  },
  yesterday: {
    budget: null,
    cost: null
  }
}
Stats.propTypes = {
  open: PropTypes.shape({
    budget: PropTypes.number,
    cost: PropTypes.number
  }),
  yesterday: PropTypes.shape({
    budget: PropTypes.number,
    cost: PropTypes.number
  })
}
Stats.contextTypes = {
  locales: PropTypes.string
}

const Workspace = ({company, workspace, del, fave, unfave}) => (
  <ThumbLink to={`/company/${company}/workspace/${workspace.id}`} title={workspace.name}>
    <Cap>{workspace.name}</Cap>
    <Stats {...(workspace.stats || {})}/>
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

        <Fence canEditWorkspace>
          <MenuItem tag={Link} to={`/company/${company}/workspace/${workspace.id}/edit`} icon='mode_edit'>
            <Message>editWorkspace</Message>
          </MenuItem>
        </Fence>

        <Fence canEditWorkspace>
          <MenuItem tag={DeleteSpan} entityName={workspace.name} onClick={del} icon='delete'>
            <Message>deleteWorkspace</Message>
          </MenuItem>
        </Fence>
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
    location: PropTypes.object,
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
  componentDidMount () {
    const {company: {id: companyId, workspaces}, dispatch, location: {query}} = this.props

    let promise = Promise.resolve()

    forEach(workspaces, ({id: workspaceId}) => {
      promise = promise.then(() =>
        dispatch(loadWorkspaceStatsAction, companyId, workspaceId, Boolean(query.fresh)))
    })
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
