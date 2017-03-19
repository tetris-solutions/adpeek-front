import omit from 'lodash/omit'
import FormMixin from './mixins/FormMixin'
import Message from 'tetris-iso/Message'
import React from 'react'
import AccountSelector from './WorkspaceAccountSelector'
import Input from './Input'
import RolesSelector from './WorkspaceRolesSelector'
import {updateWorkspaceAction} from '../actions/update-workspace'
import {Form, Content, Header, Footer} from './Card'
import {node} from './higher-order/branch'
import WorkspaceForm from './mixins/WorkspaceForm'
import Page from './Page'
import SubHeader from './SubHeader'
import {PropertySelector, ViewSelector} from './WorkspaceGAFieldSelector'

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
  componentWillMount () {
    const {workspace: {accounts: {analytics}}} = this.props

    if (analytics) {
      this.setState({gaAccount: analytics})

      if (analytics.ga_property) {
        this.setState({gaProperty: analytics.ga_property})
      }

      if (analytics.ga_view) {
        this.setState({gaProperty: analytics.ga_view})
      }
    }
  },
  onSubmit (e) {
    e.preventDefault()

    const data = this.serializeWorkspaceForm(e.target)

    data.id = this.props.params.workspace

    this.saveWorkspace(data, updateWorkspaceAction)
  },
  onChangeName ({target: {value}}) {
    const errors = omit(this.state.errors, 'name')

    this.setState({errors, 'name': value})
  },
  render () {
    const {errors, name, gaAccount, gaProperty, gaView} = this.state
    const {workspace} = this.props
    const roles = workspace.roles
    const {accounts: {facebook, adwords, analytics}} = workspace

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
                disabled={Boolean(facebook)}
                account={facebook}
                value={facebook ? facebook.name : ''}
                platform='facebook'/>

              <AccountSelector
                disabled={Boolean(adwords)}
                account={adwords}
                value={adwords ? adwords.name : ''}
                platform='adwords'/>

              <AccountSelector
                disabled={Boolean(analytics)}
                account={gaAccount}
                value={gaAccount ? gaAccount.name : ''}
                platform='analytics'
                onChange={this.onChangeAnalyticsAccount}/>

              {gaAccount && (
                <PropertySelector
                  disabled={Boolean(gaProperty)}
                  onChange={this.onChangeProperty}
                  params={{account: gaAccount.id}}/>)}

              {gaProperty && (
                <ViewSelector
                  disabled={Boolean(gaView)}
                  onChange={this.onChangeView}
                  params={{account: gaAccount.id, property: gaProperty.id}}/>)}

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

export default node('company', 'workspace', WorkspaceEdit)
