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
import {notNullable} from '../higher-order/not-nullable'
import {collection} from '../higher-order/branch'
import {Container} from '../ThumbLink'
import SubHeader, {SubHeaderButton} from '../SubHeader'
import Page from '../Page'
import {Link} from 'react-router'
import {loadWorkspaceStatsAction} from '../../actions/load-workspace-stats'
import {styled} from '../mixins/styled'
import style from './style'
import Workspace from './Item'
import Switch from '../Switch'
import {loadCompanyWorkspacesAction} from '../../actions/load-company-workspaces'

const cleanStr = str => trim(deburr(lowerCase(str)))

const Items = ({favorites, others, reload, children}) => (
  <Container>
    {children}
    {favorites && (
      <h5>
        <Message>faveWorkspaceList</Message>
      </h5>)}

    {map(favorites, (workspace, index) =>
      <Workspace
        key={workspace.id}
        reload={reload}
        params={{workspace: workspace.id}}/>)}

    {favorites && <br/>}
    {favorites && <br/>}

    {others && <h5><Message>workspaceList</Message></h5>}

    {map(others, (workspace, index) =>
      <Workspace
        key={workspace.id}
        reload={reload}
        params={{workspace: workspace.id}}/>)}
  </Container>
)
Items.displayName = 'Items'
Items.propTypes = {
  reload: React.PropTypes.func,
  children: React.PropTypes.node,
  favorites: React.PropTypes.array,
  others: React.PropTypes.array
}

const isFav = ({favorite}) => favorite ? 'favorites' : 'others'

const matching = (searchValue, workspaces) => searchValue
  ? filter(workspaces, ({name}) => includes(cleanStr(name), searchValue))
  : workspaces

let List = ({searchValue, workspaces, reload, children}) =>
  <Items {...groupBy(orderBy(matching(searchValue, workspaces), ['creation'], ['desc']), isFav)} reload={reload}>
    {children}
  </Items>

List.displayName = 'List'
List.propTypes = {
  reload: React.PropTypes.func,
  children: React.PropTypes.node,
  searchValue: React.PropTypes.string,
  workspaces: React.PropTypes.array
}
List = collection('company', 'workspaces', List)

export const Workspaces = React.createClass({
  displayName: 'Workspaces',
  mixins: [styled(style)],
  propTypes: {
    params: React.PropTypes.shape({
      company: React.PropTypes.string
    }),
    location: React.PropTypes.object,
    dispatch: React.PropTypes.func,
    company: React.PropTypes.shape({
      id: React.PropTypes.string,
      workspaces: React.PropTypes.array
    })
  },
  contextTypes: {
    router: React.PropTypes.object
  },
  getInitialState () {
    return {
      visibleOnly: true,
      searchValue: ''
    }
  },
  componentDidMount () {
    const {company: {id: companyId, workspaces}, dispatch, location: {query}} = this.props

    forEach(workspaces, ({id: workspaceId}) =>
      dispatch(loadWorkspaceStatsAction, companyId, workspaceId, Boolean(query.fresh)))
  },
  onChange (searchValue) {
    this.setState({searchValue})
  },
  onSwitch ({target: {checked: visibleOnly}}) {
    this.setState({visibleOnly}, this.reload)
  },
  reload () {
    this.props.dispatch(
      loadCompanyWorkspacesAction,
      this.props.params,
      !this.state.visibleOnly
    )
  },
  render () {
    const searchValue = cleanStr(this.state.searchValue)

    return (
      <div>
        <SubHeader>
          <Fence canEditWorkspace>
            <SubHeaderButton tag={Link} to={`/company/${this.props.company.id}/create/workspace`}>
              <i className='material-icons'>add</i>
              <Message>newWorkspaceHeader</Message>
            </SubHeaderButton>
          </Fence>
          <SearchBox onChange={this.onChange}/>
        </SubHeader>
        <Page>
          <List searchValue={searchValue} reload={this.reload}>
            <span style={{float: 'right'}}>
              <Switch
                checked={this.state.visibleOnly}
                name='visibleOnly'
                label={<Message>filterActiveOnly</Message>}
                onChange={this.onSwitch}/>
            </span>
          </List>
        </Page>
      </div>
    )
  }
})

export default notNullable(Workspaces, 'company')
