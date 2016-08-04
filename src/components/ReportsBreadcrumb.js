import React from 'react'
import {Link} from 'react-router'
import Message from '@tetris/front-server/lib/components/intl/Message'

const {PropTypes} = React

export function ReportsBreadcrumb ({params: {company, workspace, folder}}) {
  let url = `/company/${company}`

  if (workspace) {
    url += `/workspace/${workspace}`
    if (folder) {
      url += `/folder/${folder}`
    }
  }
  url += '/reports'

  return (
    <Link to={url}>
      <Message>reports</Message>
    </Link>
  )
}

ReportsBreadcrumb.displayName = 'Reports-Breadcrumb'
ReportsBreadcrumb.propTypes = {
  params: PropTypes.shape({
    company: PropTypes.string,
    workspace: PropTypes.string,
    folder: PropTypes.string
  })
}

export default ReportsBreadcrumb
