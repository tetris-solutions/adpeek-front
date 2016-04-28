import React from 'react'
import omit from 'lodash/omit'
import FormMixin from '@tetris/front-server/lib/mixins/FormMixin'
import Input from './Input'
import AccountSelector from './WorkspaceAccountSelector'
import RolesSelector from './WorkspaceRolesSelector'
import Message from '@tetris/front-server/lib/components/intl/Message'
import {updateWorkspaceAction} from '../actions/update-workspace'
import {pushSuccessMessageAction} from '../actions/push-success-message-action'
import {serializeWorkspaceForm} from '../functions/serialize-workspace-form'
import {branch} from 'baobab-react/dist-modules/higher-order'
import {Form, Content, Header, Footer} from './FloatingForm'

const {PropTypes} = React

export const WorkspaceEdit = React.createClass({
  displayName: 'Workspace-Edit',
  mixins: [FormMixin],
  propTypes: {
    dispatch: PropTypes.func,
    params: PropTypes.shape({
      workspace: PropTypes.string,
      company: PropTypes.string
    })
  },
  contextTypes: {
    router: PropTypes.object,
    workspace: PropTypes.shape({
      id: PropTypes.string,
      name: PropTypes.string
    })
  },
  componentWillMount () {
    this.setState({
      name: this.context.workspace.name
    })
  },
  handleSubmit (e) {
    e.preventDefault()
    const {dispatch, params: {workspace, company}} = this.props
    const {router} = this.context
    const data = serializeWorkspaceForm(e.target)
    data.id = workspace

    this.preSubmit()

    return dispatch(updateWorkspaceAction, company, data)
      .then(() => dispatch(pushSuccessMessageAction))
      .then(() => {
        router.push(`/company/${company}/workspace/${workspace}`)
      })
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
    const {workspace} = this.context
    if (!workspace.accounts) return null
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
            account={facebook}
            value={facebook ? facebook.external_name : ''}
            platform='facebook'/>

          <AccountSelector
            account={adwords}
            value={adwords ? adwords.external_name : ''}
            platform='adwords'/>

          <RolesSelector roles={roles}/>
        </Content>

        <Footer>
          <Message>saveCallToAction</Message>
        </Footer>
      </Form>
    )
  }
})

export default branch({}, WorkspaceEdit)
