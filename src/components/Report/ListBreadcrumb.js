import Message from 'tetris-iso/Message'
import React from 'react'
import {Link} from 'react-router'
import Fence from '../Fence'
import compact from 'lodash/compact'
import join from 'lodash/join'

function ReportsBreadcrumb ({params: {company, workspace, folder}}) {
  const scope = join(compact([
    `company/${company}`,
    workspace && `workspace/${workspace}`,
    folder && `folder/${folder}`
  ]), '/')

  const url = `/${scope}/reports`

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
  params: React.PropTypes.shape({
    company: React.PropTypes.string,
    workspace: React.PropTypes.string,
    folder: React.PropTypes.string
  })
}

export default ReportsBreadcrumb
