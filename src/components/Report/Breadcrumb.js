import React from 'react'
import {Link} from 'react-router'
import join from 'lodash/join'
import compact from 'lodash/compact'

import {contextualize} from '../higher-order/contextualize'

export function ReportBreadcrumb ({params: {company, workspace, folder}, report}, {messages: {reportBreadcrumb}}) {
  const url = '/' +
    join(compact([
      `company/${company}`,
      workspace && `workspace/${workspace}`,
      folder && `folder/${folder}`,
      `report/${report.id}`
    ]), '/')

  return (
    <Link to={url} title={reportBreadcrumb}>
      <i className='material-icons'>trending_up</i>
      {report.name}
    </Link>
  )
}

ReportBreadcrumb.displayName = 'Report-Breadcrumb'
ReportBreadcrumb.propTypes = {
  report: React.PropTypes.shape({
    id: React.PropTypes.string,
    name: React.PropTypes.string
  }),
  params: React.PropTypes.shape({
    company: React.PropTypes.string,
    workspace: React.PropTypes.string,
    folder: React.PropTypes.string
  })
}
ReportBreadcrumb.contextTypes = {
  messages: React.PropTypes.object
}

export default contextualize(ReportBreadcrumb, 'report')
