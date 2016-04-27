import React from 'react'
import omit from 'lodash/omit'
import FormMixin from '@tetris/front-server/lib/mixins/FormMixin'
import Input from './Input'
import AccountSelector from './WorkspaceAccountSelector'
import RolesSelector from './WorkspaceRolesSelector'
import Message from '@tetris/front-server/lib/components/intl/Message'

const {PropTypes} = React

export const WorkspaceEdit = React.createClass({
  displayName: 'Workspace-Edit',
  mixins: [FormMixin],
  propTypes: {
    dispatch: PropTypes.func
  },
  contextTypes: {
    workspace: PropTypes.shape({
      id: PropTypes.string,
      name: PropTypes.string
    })
  },
  handleSubmit (e) {
    e.preventDefault()
  },
  saveAndDismiss (name) {
    return ({target: {value}}) => {
      const errors = omit(this.state.errors, name)
      this.setState({errors, [name]: value})
    }
  },
  render () {
    const {errors} = this.state
    const {workspace} = this.context
    if (!workspace.accounts) return null
    const name = this.state.name || workspace.name
    const roles = workspace.roles
    const {accounts: {facebook, adwords}} = workspace

    return (
      <form className='mdl-card mdl-shadow--6dp FloatingCardForm' onSubmit={this.handleSubmit}>
        <header className='mdl-card__title mdl-color--primary mdl-color-text--white'>
          <h3 className='mdl-card__title-text'>
            <Message>editWorkspaceHeader</Message>
          </h3>
        </header>

        <section className='mdl-card__supporting-text'>
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
        </section>

        <footer className='mdl-card__actions mdl-card--border'>
          <button type='submit' className='mdl-button mdl-button--colored'>
            <Message>saveCallToAction</Message>
          </button>
        </footer>
      </form>
    )
  }
})

export default WorkspaceEdit
