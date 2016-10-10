import Message from 'tetris-iso/Message'
import React from 'react'
import ButtonWithPrompt from './ButtonWithPrompt'
import flow from 'lodash/flow'

const {PropTypes} = React

const Prompt = ({entityName, onConfirm, onCancel}) => (
  <div className='mdl-grid'>
    <div className='mdl-cell mdl-cell--12-col'>
      <h2>
        <Message>deletePromptTitle</Message>
      </h2>
      <br/>
      <p style={{textAlign: 'center'}}>
        <Message html entityName={entityName}>deletePromptBody</Message>
      </p>
      <br/>
      <hr/>
      <button className='mdl-button mdl-button--accent' type='button' onClick={onCancel}>
        <Message>cancel</Message>
      </button>
      <button className='mdl-button mdl-button--primary' type='button' onClick={onConfirm}>
        <Message>remove</Message>
      </button>
    </div>
  </div>
)

Prompt.displayName = 'Prompt'
Prompt.propTypes = {
  entityName: PropTypes.node.isRequired,
  onConfirm: PropTypes.func.isRequired,
  onCancel: PropTypes.func.isRequired
}

const DeleteButton = ({className, children, entityName, onClick}) => (
  <ButtonWithPrompt className={className} label={children}>
    {({dismiss}) => (
      <Prompt
        entityName={entityName}
        onConfirm={flow(dismiss, onClick)}
        onCancel={dismiss}/>
    )}
  </ButtonWithPrompt>
)

DeleteButton.displayName = 'Delete-Buttton'
DeleteButton.propTypes = {
  className: PropTypes.string.isRequired,
  onClick: PropTypes.func.isRequired,
  children: PropTypes.node.isRequired,
  entityName: PropTypes.node.isRequired
}

export default DeleteButton
