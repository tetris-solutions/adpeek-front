import React from 'react'
import PropTypes from 'prop-types'
import {Button} from '../../Button'
import Message from 'tetris-iso/Message'
import ButtonWithPrompt from 'tetris-iso/ButtonWithPrompt'

const DescriptionDialog = ({module}, {messages}) => (
  <ButtonWithPrompt
    size='large'
    tag={props => <Button {...props} title={messages.croppedResultAlertTitle}/>}
    label={<i className='material-icons'>info_outline</i>}
    className='mdl-button mdl-button--icon'>
    {({dismiss}) => (
      <div className='mdl-grid'>
        <div className='mdl-cell mdl-cell--12-col'>
          <h3>
            {module.name}
          </h3>
        </div>
        <div className='mdl-cell mdl-cell--12-col'>
          <blockquote
            style={{fontSize: '12pt'}}
            dangerouslySetInnerHTML={{__html: module.description.replace(/\n/g, '<br/>')}}/>
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
DescriptionDialog.displayName = 'Description-Dialog'
DescriptionDialog.propTypes = {
  module: PropTypes.object.isRequired
}
DescriptionDialog.contextTypes = {
  messages: PropTypes.object.isRequired
}

export default DescriptionDialog
