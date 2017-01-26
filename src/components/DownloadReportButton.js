import React from 'react'
import {Button} from './Button'
import Message from 'tetris-iso/Message'
const btClass = 'mdl-button mdl-color-text--grey-100'

function DownloadReportButton ({loading, extract}) {
  return (
    <Button disabled={loading} onClick={extract} className={btClass}>
      {loading
        ? <Message>creatingReport</Message>
        : <Message>extractReport</Message>}
    </Button>
  )
}

DownloadReportButton.displayName = 'Download-Report-Button'
DownloadReportButton.propTypes = {
  loading: React.PropTypes.bool,
  extract: React.PropTypes.func
}

export default DownloadReportButton
