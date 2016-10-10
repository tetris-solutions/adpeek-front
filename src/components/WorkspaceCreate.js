import React from 'react'
import FormMixin from './mixins/FormMixin'
import Message from 'tetris-iso/Message'
import Input from './Input'
import AccountSelector from './WorkspaceAccountSelector'
import RolesSelector from './WorkspaceRolesSelector'
import {createWorkspaceAction} from '../actions/create-workspace'
import {pushSuccessMessageAction} from '../actions/push-success-message-action'
import {serializeWorkspaceForm} from '../functions/serialize-workspace-form'
import {Form, Content, Header, Footer} from './Card'
import {contextualize} from './higher-order/contextualize'
import {loadDashCampaignsAction} from '../actions/load-dash-campaigns'
import Select from './Select'
import map from 'lodash/map'

const {PropTypes} = React

export const CreateWorkspace = React.createClass({
  displayName: 'Create-Workspace',
  mixins: [FormMixin],
  propTypes: {
    dispatch: PropTypes.func,
    company: PropTypes.object
  },
  contextTypes: {
    router: PropTypes.object
  },
  componentWillMount () {
    const {company, dispatch} = this.props

    if (!company.dashCampaigns) {
      dispatch(loadDashCampaignsAction, company.id)
    }
  },
  /**
   * handles submit event
   * @param {Event} e submit event
   * @returns {Promise} promise that resolves once action is complete
   */
  handleSubmit (e) {
    e.preventDefault()
    const {router} = this.context
    const {dispatch, company} = this.props

    this.preSubmit()

    return dispatch(createWorkspaceAction, company.id, serializeWorkspaceForm(e.target))
      .then(() => dispatch(pushSuccessMessageAction))
      .then(() => {
        router.push(`/company/${company.id}`)
      })
      .catch(this.handleSubmitException)
      .then(this.posSubmit)
  },
  render () {
    const {company} = this.props
    const {errors} = this.state

    return (
      <Form onSubmit={this.handleSubmit}>
        <Header>
          <Message>newWorkspaceHeader</Message>
        </Header>

        <Content>
          <Input label='name' name='name' error={errors.name} onChange={this.dismissError}/>
          <AccountSelector platform='facebook'/>
          <AccountSelector platform='adwords'/>
          <Select name='dash_campaign' label='dashCampaign'>
            <option value=''/>
            {map(company.dashCampaigns, ({id, name}) =>
              <option key={id} value={id}>
                {name}
              </option>)}
          </Select>
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
