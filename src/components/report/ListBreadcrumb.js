import Message from '@tetris/front-server/Message'
import React from 'react'
import PropTypes from 'prop-types'
import {Link} from 'react-router'
import Fence from '../Fence'
import compact from 'lodash/compact'
import join from 'lodash/join'

function ReportsBreadcrumb ({params: {company, workspace, folder}}) {
  const scope = join(compact([
    `c/${company}`,
    workspace && `w/${workspace}`,
    folder && `f/${folder}`
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
