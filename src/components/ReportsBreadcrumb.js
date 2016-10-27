import Message from 'tetris-iso/Message'
import React from 'react'
import {Link} from 'react-router'
import Fence from './Fence'
import compact from 'lodash/compact'
import join from 'lodash/join'

const {PropTypes} = React

export function ReportsBreadcrumb ({params: {company, workspace, folder}}) {
  const scope = join(compact([
    company && `company/${company}`,
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
  params: PropTypes.shape({
    company: PropTypes.string,
    workspace: PropTypes.string,
    folder: PropTypes.string
  })
}

export default ReportsBreadcrumb
