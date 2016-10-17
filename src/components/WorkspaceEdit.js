import omit from 'lodash/omit'
import FormMixin from './mixins/FormMixin'
import Message from 'tetris-iso/Message'
import React from 'react'
import map from 'lodash/map'
import get from 'lodash/get'
import AccountSelector from './WorkspaceAccountSelector'
import Input from './Input'
import RolesSelector from './WorkspaceRolesSelector'
import {updateWorkspaceAction} from '../actions/update-workspace'
import {Form, Content, Header, Footer} from './Card'
import {contextualize} from './higher-order/contextualize'
import AutoSelect from './AutoSelect'
import WorkspaceForm from './mixins/WorkspaceForm'

const {PropTypes} = React
const normalizeDCampaign = ({id: value, name: text}) => ({text, value})

export const WorkspaceEdit = React.createClass({
  displayName: 'Workspace-Edit',
  mixins: [FormMixin, WorkspaceForm],
  propTypes: {
    company: PropTypes.shape({
      dashCampaigns: PropTypes.array
    }).isRequired,
    dispatch: PropTypes.func.isRequired,
    params: PropTypes.shape({
      workspace: PropTypes.string,
      company: PropTypes.string
    }),
    workspace: PropTypes.shape({
      id: PropTypes.string,
      name: PropTypes.string,
      dash_campaign: PropTypes.string
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
    const {errors, name, dashCampaign} = this.state
    const {company, workspace} = this.props
    const roles = workspace.roles
    const {accounts: {facebook, adwords}} = workspace

    return (
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

          <input type='hidden' name='dash_campaign' value={get(dashCampaign, 'id', '')}/>

          <AutoSelect
            placeholder={this.context.messages.dashCampaignLabel}
            onChange={this.onChangeDashCampaign}
            options={map(company.dashCampaigns, normalizeDCampaign)}
            selected={dashCampaign ? normalizeDCampaign(dashCampaign) : null}/>

          <RolesSelector roles={roles}/>
        </Content>

        <Footer>
          <Message>save</Message>
        </Footer>
      </Form>
    )
  }
})

export default contextualize(WorkspaceEdit, 'workspace', 'company')
