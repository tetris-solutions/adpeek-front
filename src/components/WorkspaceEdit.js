import omit from 'lodash/omit'
import FormMixin from './mixins/FormMixin'
import Message from 'tetris-iso/Message'
import React from 'react'
import map from 'lodash/map'

import Select from './Select'
import AccountSelector from './WorkspaceAccountSelector'
import Input from './Input'
import RolesSelector from './WorkspaceRolesSelector'
import {pushSuccessMessageAction} from '../actions/push-success-message-action'
import {updateWorkspaceAction} from '../actions/update-workspace'
import {serializeWorkspaceForm} from '../functions/serialize-workspace-form'
import {Form, Content, Header, Footer} from './Card'
import {contextualize} from './higher-order/contextualize'
import {loadDashCampaignsAction} from '../actions/load-dash-campaigns'

const {PropTypes} = React

export const WorkspaceEdit = React.createClass({
  displayName: 'Workspace-Edit',
  mixins: [FormMixin],
  contextTypes: {
    router: PropTypes.object
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
      name: PropTypes.string
    })
  },
  componentWillMount () {
    const {workspace, company, dispatch} = this.props

    this.setState({
      name: workspace.name
    })

    if (!company.dashCampaigns) {
      dispatch(loadDashCampaignsAction, company.id)
    }
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
  render () {
    const {errors, name} = this.state
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

          <Select name='dash_campaign' label='dashCampaign'>
            <option value=''/>
            {map(company.dashCampaigns, ({id, name}) =>
              <option key={id} value={id}>
                {`${id} :: ${name}`}
              </option>)}
          </Select>

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
