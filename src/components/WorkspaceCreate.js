import React from 'react'
import FormMixin from '@tetris/front-server/lib/mixins/FormMixin'
import Message from '@tetris/front-server/lib/components/intl/Message'
import TrivialInput from './TrivialInput'
import AccountSelector from './WorkspaceAccountSelector'
// const {PropTypes} = React

export const CreateWorkspace = React.createClass({
  displayName: 'Create-Workspace',
  mixins: [FormMixin],
  render () {
    return (
      <form>
        <h3>
          <Message>newWorkspaceHeader</Message>
        </h3>

        <TrivialInput label='name'/>

        <div className='mdl-grid'>
          <div className='mdl-cell mdl-cell-6-col'>
            <label>Facebook</label>
            <AccountSelector platform='facebook'/>
          </div>
          <div className='mdl-cell mdl-cell-6-col'>
            <label>Adwords</label>
            <AccountSelector platform='adwords'/>
          </div>
        </div>
      </form>
    )
  }
})

export default CreateWorkspace
