import React from 'react'
import {Button} from './Button'
import Message from 'tetris-iso/Message'
const btClass = 'mdl-button mdl-color-text--grey-100'

function DownloadReportButton ({loading, extract, report}) {
  if (report) {
    return (
      <a href={report.url} className={btClass}>
        <Message>extractReport</Message>
      </a>
    )
  }

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
  extract: React.PropTypes.func,
  report: React.PropTypes.shape({
    url: React.PropTypes.string
  })
}

export default DownloadReportButton
