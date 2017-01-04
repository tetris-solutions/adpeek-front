import React from 'react'
import {Button} from '../../Button'
import Message from 'tetris-iso/Message'
import ButtonWithPrompt from 'tetris-iso/ButtonWithPrompt'
import {prettyNumber} from '../../../functions/pretty-number'

const CroppedResultDialog = ({module, size}, {messages, locales}) => (
  <ButtonWithPrompt
    tag={props => <Button {...props} title={messages.croppedResultAlertTitle}/>}
    label={<i className='material-icons'>warning</i>}
    className='mdl-button mdl-button--icon'>
    {({dismiss}) => (
      <div className='mdl-grid'>
        <div className='mdl-cell mdl-cell--12-col'>
          <h3>
            <Message>croppedResultAlertTitle</Message>
          </h3>
        </div>
        <div className='mdl-cell mdl-cell--12-col'>
          <blockquote style={{fontSize: '12pt'}}>
            <Message html module={module} size={prettyNumber(size, 'decimal', locales)}>
              croppedResultAlertBody
            </Message>
          </blockquote>
          <br/>
          <br/>
          <hr/>
        </div>

        <div className='mdl-cell mdl-cell--12-col'>
          <Button onClick={dismiss} className='mdl-button mdl-button--primary'>
            <Message>close</Message>
          </Button>
        </div>
      </div>
    )}
  </ButtonWithPrompt>
)
CroppedResultDialog.displayName = 'Cropped-Result-Dialog'
CroppedResultDialog.propTypes = {
  module: React.PropTypes.string.isRequired,
  size: React.PropTypes.number.isRequired
}
CroppedResultDialog.contextTypes = {
  messages: React.PropTypes.object.isRequired,
  locales: React.PropTypes.string.isRequired
}

export default CroppedResultDialog
