import React from 'react'
import FormMixin from './mixins/FormMixin'
import Message from 'tetris-iso/Message'
import Input from './Input'
import AccountSelector from './WorkspaceAccountSelector'
import {loadGAPropertiesAction} from '../actions/load-ga-properties'
// import AutoSelect from './AutoSelect'
import RolesSelector from './WorkspaceRolesSelector'
import {createWorkspaceAction} from '../actions/create-workspace'
import {Form, Content, Header, Footer} from './Card'
import WorkspaceForm from './mixins/WorkspaceForm'
import {branch} from './higher-order/branch'
import Page from './Page'
import SubHeader from './SubHeader'

export const CreateWorkspace = React.createClass({
  displayName: 'Create-Workspace',
  mixins: [FormMixin, WorkspaceForm],
  propTypes: {
    dispatch: React.PropTypes.func,
    params: React.PropTypes.object
  },
  getInitialState () {
    return {gaAccount: null}
  },
  onSubmit (e) {
    e.preventDefault()

    const data = this.serializeWorkspaceForm(e.target)

    this.saveWorkspace(data, createWorkspaceAction)
  },
  onChangeAnalyticsAccount (account) {
    const {dispatch, params} = this.props

    if (account) {
      this.setState({gaAccount: account.external_id})

      dispatch(loadGAPropertiesAction, params, account)
    } else {
      this.setState({gaAccount: null})
    }
  },
  render () {
    const {errors} = this.state

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

export default branch({}, CreateWorkspace)
