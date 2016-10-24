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
import {Container, Title, Button, ThumbLink} from './ThumbLink'
import SubHeader from './SubHeader'
import Page from './Page'

const {PropTypes} = React
const cleanStr = str => trim(deburr(lowerCase(str)))

function Workspace ({company, id, name}) {
  return (
    <ThumbLink to={`/company/${company}/workspace/${id}`} title={name}>
      <Title>{name}</Title>
    </ThumbLink>
  )
}

Workspace.displayName = 'Workspace'
Workspace.propTypes = {
  id: PropTypes.string,
  company: PropTypes.string,
  name: PropTypes.string
}

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
        <SubHeader title={<Message>workspaceList</Message>}>
          <SearchBox onChange={this.onChange}/>
        </SubHeader>
        <Page>
          <Container>
            {map(matchingWorkspaces, (workspace, index) =>
              <Workspace key={index} {...workspace} company={id}/>)}

            <Fence canEditWorkspace>
              <ThumbLink to={`/company/${id}/create/workspace`} sad>
                <Button>
                  <Message>newWorkspaceHeader</Message>
                </Button>
              </ThumbLink>
            </Fence>
          </Container>
        </Page>
      </div>
    )
  }
})

export default contextualize(Workspaces, 'company')
