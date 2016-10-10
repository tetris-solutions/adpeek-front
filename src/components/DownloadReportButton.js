import React from 'react'
import Message from 'tetris-iso/Message'

const {PropTypes} = React
const btClass = 'mdl-button mdl-color-text--grey-100'

const DownloadReportButton = ({loading, extract, report}) => {
  if (report) {
    return (
      <a href={report.url} className={btClass}>
        <Message>extractReport</Message>
      </a>
    )
  }

  return (
    <button disabled={loading} onClick={extract} className={btClass}>
      {loading
        ? <Message>creatingReport</Message>
        : <Message>extractReport</Message>}
    </button>
  )
}

DownloadReportButton.displayName = 'Download-Report-Button'
DownloadReportButton.propTypes = {
  loading: PropTypes.bool,
  extract: PropTypes.func,
  report: PropTypes.shape({
    url: PropTypes.string
  })
}

export default DownloadReportButton
