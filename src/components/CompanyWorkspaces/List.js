import trim from 'lodash/trim'
import deburr from 'lodash/deburr'
import orderBy from 'lodash/orderBy'
import lowerCase from 'lodash/toLower'
import filter from 'lodash/filter'
import forEach from 'lodash/forEach'
import groupBy from 'lodash/groupBy'
import includes from 'lodash/includes'
import map from 'lodash/map'
import Message from 'tetris-iso/Message'
import React from 'react'
import Fence from '../Fence'
import SearchBox from '../HeaderSearchBox'
import {requires} from '../higher-order/not-nullable'
import {Container} from '../ThumbLink'
import SubHeader, {SubHeaderButton} from '../SubHeader'
import Page from '../Page'
import {Link} from 'react-router'
import {deleteWorkspaceAction} from '../../actions/delete-workspace'
import {loadCompanyWorkspacesAction} from '../../actions/load-company-workspaces'
import {unfavoriteWorkspaceAction} from '../../actions/unfavorite-workspace'
import {favoriteWorkspaceAction} from '../../actions/favorite-workspace'
import {loadWorkspaceStatsAction} from '../../actions/load-workspace-stats'
import bind from 'lodash/bind'
import {styled} from '../mixins/styled'
import style from './style'
import Workspace from './Item'

const cleanStr = str => trim(deburr(lowerCase(str)))

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
    const {company: {id, workspaces}} = this.props
    const matchingWorkspaces = orderBy(
      searchValue
        ? filter(workspaces, ({name}) => includes(cleanStr(name), searchValue))
        : workspaces,
      ['creation'], ['desc']
    )

    const list = groupBy(matchingWorkspaces, ({favorite}) => favorite ? 'favorites' : 'others')

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
            {list.favorites && (
              <h5>
                <Message>faveWorkspaceList</Message>
              </h5>)}

            {map(list.favorites, (workspace, index) =>
              <Workspace
                key={workspace.id}
                params={{workspace: workspace.id}}
                fave={bind(this.favoriteWorkspace, null, workspace.id)}
                unfave={bind(this.unfavoriteWorkspace, null, workspace.id)}
                del={bind(this.deleteWorkspace, null, workspace.id)}/>)}

            {list.favorites && <br/>}
            {list.favorites && <br/>}

            {list.others && <h5><Message>workspaceList</Message></h5>}
            {map(list.others, (workspace, index) =>
              <Workspace
                key={workspace.id}
                params={{workspace: workspace.id}}
                fave={bind(this.favoriteWorkspace, null, workspace.id)}
                unfave={bind(this.unfavoriteWorkspace, null, workspace.id)}
                del={bind(this.deleteWorkspace, null, workspace.id)}/>)}
          </Container>
        </Page>
      </div>
    )
  }
})

export default requires(Workspaces, 'company')
