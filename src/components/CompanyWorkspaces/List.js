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

const cleanStr = str => trim(deburr(lowerCase(str)))

const Items = ({favorites, others}) => (
  <Container>
    {favorites && (
      <h5>
        <Message>faveWorkspaceList</Message>
      </h5>)}

    {map(favorites, (workspace, index) =>
      <Workspace
        key={workspace.id}
        params={{workspace: workspace.id}}/>)}

    {favorites && <br/>}
    {favorites && <br/>}

    {others && <h5><Message>workspaceList</Message></h5>}

    {map(others, (workspace, index) =>
      <Workspace
        key={workspace.id}
        params={{workspace: workspace.id}}/>)}
  </Container>
)
Items.displayName = 'Items'
Items.propTypes = {
  favorites: React.PropTypes.array,
  others: React.PropTypes.array
}

const isFav = ({favorite}) => favorite ? 'favorites' : 'others'

const matching = (searchValue, workspaces) => searchValue
  ? filter(workspaces, ({name}) => includes(cleanStr(name), searchValue))
  : workspaces

let List = ({searchValue, workspaces}) =>
  <Items {...groupBy(orderBy(matching(searchValue, workspaces), ['creation'], ['desc']), isFav)}/>

List.displayName = 'List'
List.propTypes = {
  searchValue: React.PropTypes.string,
  workspaces: React.PropTypes.array
}
List = collection('company', 'workspaces', List)

export const Workspaces = React.createClass({
  displayName: 'Workspaces',
  mixins: [styled(style)],
  propTypes: {
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
          <List searchValue={searchValue}/>
        </Page>
      </div>
    )
  }
})

export default notNullable(Workspaces, 'company')
