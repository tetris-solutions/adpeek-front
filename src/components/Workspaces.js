import deburr from 'lodash/deburr'
import isNumber from 'lodash/isNumber'
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
import {DropdownMenu, MenuItem, HeaderMenuItem} from './DropdownMenu'
import SubHeader, {SubHeaderButton} from './SubHeader'
import Page from './Page'
import {Link} from 'react-router'
import {deleteWorkspaceAction} from '../actions/delete-workspace'
import {loadCompanyWorkspacesAction} from '../actions/load-company-workspaces'
import {unfavoriteWorkspaceAction} from '../actions/unfavorite-workspace'
import {favoriteWorkspaceAction} from '../actions/favorite-workspace'
import {loadWorkspaceStatsAction} from '../actions/load-workspace-stats'
import {DeleteSpan} from './DeleteButton'
import bind from 'lodash/bind'
import csjs from 'csjs'
import {styled} from './mixins/styled'
import {prettyNumber} from '../functions/pretty-number'
import ReportLink from './Report/ReportLink'

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
}
.iconLabel {
  display: inline-block;
  transform: translateY(-.4em);
  padding-left: .3em;
}`

const cleanStr = str => trim(deburr(lowerCase(str)))

const num = val => !isNumber(val) ? 0 : val
const division = (a, b) => b === 0 ? 0 : a / b

const colors = {
  neutral: {
    icon: 'sentiment_neutral',
    color: 'mdl-color-text--grey-900'
  },
  bad: {
    icon: 'sentiment_very_dissatisfied',
    color: 'mdl-color-text--red-900'
  },
  good: {
    icon: 'mood',
    color: 'mdl-color-text--green-900'
  }
}
function goal (percent) {
  if (percent < 70 || percent > 110) {
    return colors.bad
  }

  if (percent >= 95) {
    return colors.good
  }

  return colors.neutral
}

const Daily = ({budget, cost, locales}) => {
  let icon, color, label

  if (!isNumber(budget) || !isNumber(cost)) {
    icon = colors.neutral.icon
    color = colors.neutral.color
    label = '--'
  } else {
    const ratio = division(num(cost), num(budget))
    const c = goal(ratio * 100)

    icon = c.icon
    color = c.color
    label = prettyNumber(ratio, 'percentage', locales)
  }

  const currency = n => isNumber(n)
    ? prettyNumber(n, 'currency', locales)
    : 'R$ --'

  return (
    <div>
      <div className={`${style.label}`}>
        <Message>investmentDayLabel</Message>:
      </div>

      <div className={`${style.stats} ${color}`} title={`${currency(cost)} / ${currency(budget)}`}>
        <i className='material-icons'>{icon}</i>
        <span className={`${style.iconLabel}`}>{label}</span>
      </div>
    </div>
  )
}

Daily.displayName = 'Daily'

const Period = ({cost, budget, locales}) => (
  <div>
    <div className={`${style.label}`}>
      <Message>investmentLabel</Message>:
    </div>

    <div className={`${style.stats}`}>
      <div className={`${style.numbers}`}>
        <strong>
          {!isNumber(cost) ? '--' : prettyNumber(cost, 'currency', locales)}
        </strong>
        <span className='mdl-color-text--grey-600'>
          {' / '}
          {!isNumber(budget) ? '--' : prettyNumber(budget, 'currency', locales)}
        </span>
      </div>
      <div className={`mdl-color--grey-300 ${style.rail}`}>
        <div
          style={{width: Math.min(100, Math.floor(100 * division(num(cost), num(budget)))) + '%'}}
          className={num(cost) > num(budget)
            ? 'mdl-color--red-800'
            : 'mdl-color--primary'}/>
      </div>
    </div>
  </div>
)

Period.displayName = 'Period'
Period.propTypes = Daily.propTypes = {
  locales: React.PropTypes.string,
  budget: React.PropTypes.number,
  cost: React.PropTypes.number
}

const Stats = ({open, yesterday}, {locales, location: {query}}) => (
  <div className={`${style.statsWrap}`}>
    <Period {...open} locales={locales}/>
    <Daily {...yesterday} locales={locales}/>
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
  open: React.PropTypes.shape({
    budget: React.PropTypes.number,
    cost: React.PropTypes.number
  }),
  yesterday: React.PropTypes.shape({
    budget: React.PropTypes.number,
    cost: React.PropTypes.number
  })
}
Stats.contextTypes = {
  locales: React.PropTypes.string.isRequired,
  location: React.PropTypes.object.isRequired
}

const Workspace = ({company, workspace, del, fave, unfave, dispatch}) => (
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

        <ReportLink
          tag={MenuItem}
          params={{company, workspace: workspace.id}}
          reports={workspace.reports}
          dispatch={dispatch}>
          <Message>workspaceReport</Message>
        </ReportLink>

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
  dispatch: React.PropTypes.func.isRequired,
  company: React.PropTypes.string.isRequired,
  workspace: React.PropTypes.object.isRequired,
  del: React.PropTypes.func.isRequired,
  fave: React.PropTypes.func.isRequired,
  unfave: React.PropTypes.func.isRequired
}
Workspace.contextTypes = {
  router: React.PropTypes.object
}

export const Workspaces = React.createClass({
  displayName: 'Workspaces',
  mixins: [styled(style)],
  propTypes: {
    location: React.PropTypes.object,
    dispatch: React.PropTypes.func,
    company: React.PropTypes.shape({
      workspaces: React.PropTypes.array
    })
  },
  contextTypes: {
    router: React.PropTypes.object
  },
  getInitialState () {
    return {
      searchValue: ''
    }
  },
  componentDidMount () {
    const {company: {id: companyId, workspaces}, dispatch, location: {query}} = this.props

    forEach(workspaces, ({id: workspaceId}) =>
      dispatch(loadWorkspaceStatsAction, companyId, workspaceId, Boolean(query.fresh)))
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
    const {dispatch, company: {id, workspaces}} = this.props
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
                dispatch={dispatch}
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
                dispatch={dispatch}
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
