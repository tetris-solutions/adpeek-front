import React from 'react'
import Message from 'tetris-iso/Message'
import {Button} from './Button'

function CalculateRelevanceButton ({isCalculating, done, start}) {
  return (
    <Button
      className='mdl-button mdl-color-text--grey-100'
      disabled={isCalculating || done}
      onClick={start}>

      {isCalculating
        ? <Message>calculating</Message>
        : <Message>calculateKeywordsRelevance</Message>}
    </Button>
  )
}

CalculateRelevanceButton.displayName = 'Calculate-Relevance-Button'
CalculateRelevanceButton.propTypes = {
  isCalculating: React.PropTypes.bool.isRequired,
  done: React.PropTypes.bool.isRequired,
  start: React.PropTypes.func.isRequired
}

export default CalculateRelevanceButton

