import React from 'react'
import FormMixin from '@tetris/front-server/lib/mixins/FormMixin'
import Message from '@tetris/front-server/lib/components/intl/Message'
import Input from './Input'
import AccountSelector from './WorkspaceAccountSelector'
import RolesSelector from './WorkspaceRolesSelector'
import {branch} from 'baobab-react/dist-modules/higher-order'
import {createWorkspaceAction} from '../actions/create-workspace'
import {pushSuccessMessageAction} from '../actions/push-success-message-action'
import {serializeWorkspaceForm} from '../functions/serialize-workspace-form'
import {Form, Content, Header, Footer} from './FloatingForm'

const {PropTypes} = React

export const CreateWorkspace = React.createClass({
  displayName: 'Create-Workspace',
  mixins: [FormMixin],
  propTypes: {
    dispatch: PropTypes.func
  },
  contextTypes: {
    company: PropTypes.object,
    router: PropTypes.object
  },
  /**
   * handles submit event
   * @param {Event} e submit event
   * @returns {Promise} promise that resolves once action is complete
   */
  handleSubmit (e) {
    e.preventDefault()
    const {router, company} = this.context
    const {dispatch} = this.props

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
          <RolesSelector/>
        </Content>

        <Footer>
          <Message>newWorkspaceCallToAction</Message>
        </Footer>
      </Form>
    )
  }
})

export default branch({}, CreateWorkspace)
