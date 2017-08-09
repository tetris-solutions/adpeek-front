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
import PropTypes from 'prop-types'
import Fence from '../../Fence'
import SearchBox from '../../HeaderSearchBox'
import {breakOnEmptyProp} from '../../higher-order/not-nullable'
import {branchChildren} from '../../higher-order/branch'
import {Container} from '../../ThumbLink'
import SubHeader, {SubHeaderButton} from '../../SubHeader'
import Page from '../../Page'
import {Link} from 'react-router'
import {loadWorkspaceStatsAction} from '../../../actions/load-workspace-stats'
import {styledComponent} from '../../higher-order/styled'
import style from './style'
import Workspace from './Item'
import Switch from '../../Switch'
import {loadCompanyWorkspacesAction} from '../../../actions/load-company-workspaces'

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
  reload: PropTypes.func,
  children: PropTypes.node,
  favorites: PropTypes.array,
  others: PropTypes.array
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
  reload: PropTypes.func,
  children: PropTypes.node,
  searchValue: PropTypes.string,
  workspaces: PropTypes.array
}
List = branchChildren('company', 'workspaces', List)

class Workspaces extends React.Component {
  static displayName = 'Workspaces'

  static propTypes = {
    params: PropTypes.shape({
      company: PropTypes.string
    }),
    location: PropTypes.object,
    dispatch: PropTypes.func,
    company: PropTypes.shape({
      id: PropTypes.string,
      workspaces: PropTypes.array
    })
  }

  static contextTypes = {
    router: PropTypes.object
  }

  state = {
    visibleOnly: true,
    searchValue: ''
  }

  componentDidMount () {
    const {company: {id: companyId, workspaces}, dispatch, location: {query}} = this.props

    forEach(workspaces, ({id: workspaceId}) =>
      dispatch(loadWorkspaceStatsAction, companyId, workspaceId, Boolean(query.fresh)))
  }

  onChange = (searchValue) => {
    this.setState({searchValue})
  }

  onSwitch = ({target: {checked: visibleOnly}}) => {
    this.setState({visibleOnly}, this.reload)
  }

  reload = () => {
    this.props.dispatch(
      loadCompanyWorkspacesAction,
      this.props.params,
      !this.state.visibleOnly
    )
  }

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
}

export default breakOnEmptyProp(styledComponent(Workspaces, style), 'company')
