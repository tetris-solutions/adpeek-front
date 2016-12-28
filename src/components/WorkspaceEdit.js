import omit from 'lodash/omit'
import FormMixin from './mixins/FormMixin'
import Message from 'tetris-iso/Message'
import React from 'react'
import AccountSelector from './WorkspaceAccountSelector'
import Input from './Input'
import RolesSelector from './WorkspaceRolesSelector'
import {updateWorkspaceAction} from '../actions/update-workspace'
import {Form, Content, Header, Footer} from './Card'
import {contextualize} from './higher-order/contextualize'
import WorkspaceForm from './mixins/WorkspaceForm'
import Page from './Page'
import SubHeader from './SubHeader'

export const WorkspaceEdit = React.createClass({
  displayName: 'Workspace-Edit',
  mixins: [FormMixin, WorkspaceForm],
  propTypes: {
    dispatch: React.PropTypes.func.isRequired,
    params: React.PropTypes.shape({
      workspace: React.PropTypes.string,
      company: React.PropTypes.string
    }),
    workspace: React.PropTypes.shape({
      id: React.PropTypes.string,
      name: React.PropTypes.string
    })
  },
  onSubmit (e) {
    e.preventDefault()
    const {params: {workspace, company}} = this.props

    const data = this.serializeWorkspaceForm(e.target)
    data.id = workspace
    const redirectUrl = `/company/${company}/workspace/${workspace}`
    const action = updateWorkspaceAction

    this.saveWorkspace(data, action, redirectUrl)
  },
  onChangeName ({target: {value}}) {
    const errors = omit(this.state.errors, 'name')

    this.setState({errors, 'name': value})
  },
  render () {
    const {errors, name} = this.state
    const {workspace} = this.props
    const roles = workspace.roles
    const {accounts: {facebook, adwords}} = workspace

    return (
      <div>
        <SubHeader/>
        <Page>
          <Form onSubmit={this.onSubmit}>
            <Header>
              <Message>editWorkspaceHeader</Message>
            </Header>

            <Content>
              <Input
                label='name'
                name='name'
                error={errors.name}
                onChange={this.onChangeName}
                value={name}/>

              <AccountSelector
                disabled
                account={facebook}
                value={facebook ? facebook.name : ''}
                platform='facebook'/>

              <AccountSelector
                disabled
                account={adwords}
                value={adwords ? adwords.name : ''}
                platform='adwords'/>

              <RolesSelector roles={roles}/>
            </Content>

            <Footer>
              <Message>save</Message>
            </Footer>
          </Form>
        </Page>
      </div>
    )
  }
})

export default contextualize(WorkspaceEdit, 'workspace')
