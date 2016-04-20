import React from 'react'
import FormMixin from '@tetris/front-server/lib/mixins/FormMixin'
import Message from '@tetris/front-server/lib/components/intl/Message'
import Input from './Input'
import AccountSelector from './WorkspaceAccountSelector'
import RolesSelector from './WorkspaceRolesSelector'
import startsWith from 'lodash/startsWith'
import {branch} from 'baobab-react/dist-modules/higher-order'
import {createWorkspaceAction} from '../actions/create-workspace'
import {pushSuccessMessageAction} from '../actions/push-success-message-action'

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
   * @returns {undefined}
   */
  handleSubmit (e) {
    e.preventDefault()
    const {target: {elements}} = e
    const {router, company} = this.context
    const {dispatch} = this.props
    const data = {
      name: elements.name.value,
      accounts: {
        facebook: JSON.parse(elements.facebook_account.value),
        adwords: JSON.parse(elements.adwords_account.value)
      },
      roles: []
    }

    Object.keys(elements)
      .forEach(name => {
        const prefix = 'role_'
        if (startsWith(name, prefix) && elements[name].checked) {
          data.roles.push(name.substr(prefix.length))
        }
      })

    this.preSubmit()

    return dispatch(createWorkspaceAction, company.id, data)
      .then(() => dispatch(pushSuccessMessageAction))
      .catch(this.handleSubmitException)
      .then(() => {
        router.push(`/company/${company.id}`)
      })
      .then(this.posSubmit)
  },
  render () {
    const {errors} = this.state
    return (
      <form className='mdl-card mdl-shadow--6dp WrkCreateForm' onSubmit={this.handleSubmit}>
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
          <button type='submit' className='mdl-button mdl-button--colored mdl-js-button mdl-js-ripple-effect'>
            <Message>newWorkspaceCallToAction</Message>
          </button>
        </footer>
      </form>
    )
  }
})

export default branch({}, CreateWorkspace)
