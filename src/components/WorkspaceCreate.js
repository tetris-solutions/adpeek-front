import React from 'react'
import FormMixin from './mixins/FormMixin'
import Message from 'tetris-iso/Message'
import Input from './Input'
import AccountSelector from './WorkspaceAccountSelector'

import RolesSelector from './WorkspaceRolesSelector'
import {createWorkspaceAction} from '../actions/create-workspace'
import {Form, Content, Header, Footer} from './Card'
import WorkspaceForm from './mixins/WorkspaceForm'
import Page from './Page'
import SubHeader from './SubHeader'
import {PropertySelector, ViewSelector} from './WorkspaceGAFieldSelector'

export const CreateWorkspace = React.createClass({
  displayName: 'Create-Workspace',
  mixins: [FormMixin, WorkspaceForm],
  propTypes: {
    dispatch: React.PropTypes.func,
    params: React.PropTypes.object
  },
  onSubmit (e) {
    e.preventDefault()

    const data = this.serializeWorkspaceForm(e.target)

    this.saveWorkspace(data, createWorkspaceAction)
  },
  render () {
    const {errors, gaAccount, gaProperty} = this.state

    return (
      <div>
        <SubHeader/>
        <Page>
          <Form onSubmit={this.onSubmit}>
            <Header>
              <Message>newWorkspaceHeader</Message>
            </Header>

            <Content>
              <Input
                label='name'
                name='name'
                error={errors.name}
                onChange={this.dismissError}/>

              <AccountSelector platform='facebook'/>
              <AccountSelector platform='adwords'/>

              <AccountSelector
                platform='analytics'
                onChange={this.onChangeAnalyticsAccount}/>

              {gaAccount && (
                <PropertySelector
                  onChange={this.onChangeProperty}
                  params={{account: gaAccount.id}}/>)}

              {gaProperty && (
                <ViewSelector
                  onChange={this.onChangeView}
                  params={{account: gaAccount.id, property: gaProperty.id}}/>)}

              <RolesSelector/>
            </Content>

            <Footer>
              <Message>newWorkspaceCallToAction</Message>
            </Footer>
          </Form>
        </Page>
      </div>
    )
  }
})

export default CreateWorkspace
