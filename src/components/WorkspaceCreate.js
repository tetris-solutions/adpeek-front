import React from 'react'
import FormMixin from '@tetris/front-server/lib/mixins/FormMixin'
import Message from '@tetris/front-server/lib/components/intl/Message'
import Input from './Input'
import AccountSelector from './WorkspaceAccountSelector'
import RolesSelector from './WorkspaceRolesSelector'

// const {PropTypes} = React

export const CreateWorkspace = React.createClass({
  displayName: 'Create-Workspace',
  mixins: [FormMixin],
  render () {
    return (
      <form className='mdl-card mdl-shadow--6dp WrkCreateForm'>
        <header className='mdl-card__title mdl-color--primary mdl-color-text--white'>
          <h3 className='mdl-card__title-text'>
            <Message>newWorkspaceHeader</Message>
          </h3>
        </header>

        <section className='mdl-card__supporting-text'>
          <Input label='name'/>
          <AccountSelector platform='facebook'/>
          <AccountSelector platform='adwords'/>
          <RolesSelector/>
        </section>

        <footer className='mdl-card__actions mdl-card--border'>
          <button className='mdl-button mdl-button--colored mdl-js-button mdl-js-ripple-effect'>
            Create
          </button>
        </footer>
      </form>
    )
  }
})

export default CreateWorkspace
