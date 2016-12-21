import Message from 'tetris-iso/Message'
import React from 'react'
import {Button} from './Button'
import ButtonWithPrompt from 'tetris-iso/ButtonWithPrompt'
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
      <Button className='mdl-button mdl-button--accent' onClick={onCancel}>
        <Message>cancel</Message>
      </Button>
      <Button className='mdl-button mdl-button--primary' onClick={onConfirm}>
        <Message>remove</Message>
      </Button>
    </div>
  </div>
)

Prompt.displayName = 'Prompt'
Prompt.propTypes = {
  entityName: PropTypes.node.isRequired,
  onConfirm: PropTypes.func.isRequired,
  onCancel: PropTypes.func.isRequired
}

const DeleteButton = ({tag, className, children, entityName, onClick}) => (
  <ButtonWithPrompt className={className} label={children} tag={tag}>
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
  tag: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.func
  ]),
  className: PropTypes.string,
  onClick: PropTypes.func.isRequired,
  children: PropTypes.node.isRequired,
  entityName: PropTypes.node.isRequired
}

export const DeleteSpan = props => <DeleteButton {...props} tag='span'/>
DeleteSpan.displayName = 'Delete-Span'

export default DeleteButton
