import React from 'react'
import FormMixin from './mixins/FormMixin'
import Message from 'tetris-iso/Message'
import Input from './Input'
import AccountSelector from './WorkspaceAccountSelector'
import RolesSelector from './WorkspaceRolesSelector'
import {createWorkspaceAction} from '../actions/create-workspace'
import {Form, Content, Header, Footer} from './Card'
import {contextualize} from './higher-order/contextualize'
import map from 'lodash/map'
import WorkspaceForm from './mixins/WorkspaceForm'
import AutoSelect from './AutoSelect'
import get from 'lodash/get'

const {PropTypes} = React

export const CreateWorkspace = React.createClass({
  displayName: 'Create-Workspace',
  mixins: [FormMixin, WorkspaceForm],
  propTypes: {
    dispatch: PropTypes.func,
    company: PropTypes.object,
    params: PropTypes.object
  },
  onSubmit (e) {
    e.preventDefault()
    const {params: {company}} = this.props
    const data = this.serializeWorkspaceForm(e.target)
    const action = createWorkspaceAction
    const redirectUrl = `/company/${company}`

    this.saveWorkspace(data, action, redirectUrl)
  },
  render () {
    const {company} = this.props
    const {errors, dashCampaign} = this.state

    return (
      <Form onSubmit={this.onSubmit}>
        <Header>
          <Message>newWorkspaceHeader</Message>
        </Header>

        <Content>
          <Input label='name' name='name' error={errors.name} onChange={this.dismissError}/>
          <AccountSelector platform='facebook'/>
          <AccountSelector platform='adwords'/>
          <input type='hidden' name='dash_campaign' value={get(dashCampaign, 'id', '')}/>

          <AutoSelect
            placeholder={this.context.messages.dashCampaignLabel}
            onChange={this.onChangeDashCampaign}
            options={map(company.dashCampaigns, this.normalizeDashCampaignOption)}
            selected={dashCampaign ? this.normalizeDashCampaignOption(dashCampaign) : null}/>
          <RolesSelector/>
        </Content>

        <Footer>
          <Message>newWorkspaceCallToAction</Message>
        </Footer>
      </Form>
    )
  }
})

export default contextualize(CreateWorkspace, 'company')
