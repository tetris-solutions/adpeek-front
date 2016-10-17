import omit from 'lodash/omit'
import FormMixin from './mixins/FormMixin'
import Message from 'tetris-iso/Message'
import React from 'react'
import map from 'lodash/map'
import get from 'lodash/get'
import find from 'lodash/find'
import AccountSelector from './WorkspaceAccountSelector'
import Input from './Input'
import RolesSelector from './WorkspaceRolesSelector'
import {pushSuccessMessageAction} from '../actions/push-success-message-action'
import {updateWorkspaceAction} from '../actions/update-workspace'
import {serializeWorkspaceForm} from '../functions/serialize-workspace-form'
import {Form, Content, Header, Footer} from './Card'
import {contextualize} from './higher-order/contextualize'
import {loadDashCampaignsAction} from '../actions/load-dash-campaigns'
import AutoSelect from './AutoSelect'

const {PropTypes} = React
const normalizeDCampaign = ({id: value, name: text}) => ({text, value})

export const WorkspaceEdit = React.createClass({
  displayName: 'Workspace-Edit',
  mixins: [FormMixin],
  contextTypes: {
    router: PropTypes.object,
    messages: PropTypes.object
  },
  propTypes: {
    dispatch: PropTypes.func,
    params: PropTypes.shape({
      workspace: PropTypes.string,
      company: PropTypes.string
    }),
    company: PropTypes.object,
    workspace: PropTypes.shape({
      id: PropTypes.string,
      name: PropTypes.string,
      dash_campaign: PropTypes.string
    })
  },
  getInitialState () {
    return {
      dashCampaign: this.getCurrentCampaign(),
      name: this.props.workspace.name
    }
  },
  componentWillMount () {
    const {company, dispatch} = this.props

    if (!company.dashCampaigns) {
      dispatch(loadDashCampaignsAction, company.id)
    }
  },
  componentWillReceiveProps ({company: {dashCampaigns}}) {
    if (this.props.company.dashCampaigns !== dashCampaigns) {
      this.setState({
        dashCampaign: this.getCurrentCampaign(dashCampaigns)
      })
    }
  },
  getCurrentCampaign (dashCampaigns = this.props.company.dashCampaigns) {
    const campaignId = get(this.state, 'dashCampaign.id', this.props.workspace.dash_campaign)

    if (!campaignId) return null

    return find(dashCampaigns, {id: campaignId}) || {id: campaignId, name: campaignId}
  },
  handleSubmit (e) {
    e.preventDefault()
    const {dispatch, params: {workspace, company}} = this.props
    const data = serializeWorkspaceForm(e.target)
    const navigateToUpdatedWorkspace = () => this.context.router.push(`/company/${company}/workspace/${workspace}`)

    data.id = workspace

    this.preSubmit()

    return dispatch(updateWorkspaceAction, company, data)
      .then(() => dispatch(pushSuccessMessageAction))
      .then(navigateToUpdatedWorkspace)
      .catch(this.handleSubmitException)
      .then(this.posSubmit)
  },
  saveAndDismiss (name) {
    return ({target: {value}}) => {
      const errors = omit(this.state.errors, name)
      this.setState({errors, [name]: value})
    }
  },
  onChangeDashCampaign (dashCampaign) {
    if (dashCampaign) {
      this.setState({
        dashCampaign: find(this.props.company.dashCampaigns, {
          id: dashCampaign.value
        })
      })
    } else {
      this.setState({dashCampaign: null})
    }
  },
  render () {
    const {errors, name, dashCampaign} = this.state
    const {company, workspace} = this.props
    const roles = workspace.roles
    const {accounts: {facebook, adwords}} = workspace

    return (
      <Form onSubmit={this.handleSubmit}>
        <Header>
          <Message>editWorkspaceHeader</Message>
        </Header>

        <Content>
          <Input
            label='name'
            name='name'
            error={errors.name}
            onChange={this.saveAndDismiss('name')}
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
