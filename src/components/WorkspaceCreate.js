import React from 'react'
import FormMixin from '@tetris/front-server/lib/mixins/FormMixin'
import Message from '@tetris/front-server/lib/components/intl/Message'
import TrivialInput from './TrivialInput'

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
      </form>
    )
  }
})

export default CreateWorkspace
