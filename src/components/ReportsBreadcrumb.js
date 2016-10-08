import Message from '@tetris/front-server/lib/components/intl/Message'
import React from 'react'
import {Link} from 'react-router'
import Fence from './Fence'

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
    <Fence canBrowseReports>
      <Link to={url}>
        <i className='material-icons'>list</i>
        <Message>reports</Message>
      </Link>
    </Fence>
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
