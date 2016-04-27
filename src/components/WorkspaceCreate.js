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
      <form className='mdl-card mdl-shadow--6dp FloatingCardForm' onSubmit={this.handleSubmit}>
        <header className='mdl-card__title mdl-color--primary mdl-color-text--white'>
          <h3 className='mdl-card__title-text'>
            <Message>newWorkspaceHeader</Message>
          </h3>
        </header>

        <section className='mdl-card__supporting-text'>
          <Input label='name' name='name' error={errors.name}/>
          <AccountSelector platform='facebook'/>
          <AccountSelector platform='adwords'/>
          <RolesSelector/>
        </section>

        <footer className='mdl-card__actions mdl-card--border'>
          <button type='submit' className='mdl-button mdl-button--colored'>
            <Message>newWorkspaceCallToAction</Message>
          </button>
        </footer>
      </form>
    )
  }
})

export default branch({}, CreateWorkspace)
