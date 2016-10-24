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
import {Container, Title, ThumbLink} from './ThumbLink'
import SubHeader from './SubHeader'
import Page from './Page'
import {Link} from 'react-router'

const {PropTypes} = React
const cleanStr = str => trim(deburr(lowerCase(str)))

export const Workspaces = React.createClass({
  displayName: 'Workspaces',
  propTypes: {
    company: PropTypes.shape({
      workspaces: PropTypes.array
    })
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
              <ThumbLink to={`/company/${id}/workspace/${workspace.id}`} title={workspace.name}>
                <Title>{workspace.name}</Title>
              </ThumbLink>)}
          </Container>
        </Page>
      </div>
    )
  }
})

export default contextualize(Workspaces, 'company')
