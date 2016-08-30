import React from 'react'
import {Link} from 'react-router'

import {contextualize} from './higher-order/contextualize'

const {PropTypes} = React

export function ReportBreadcrumb ({params: {company, workspace, folder}, report}, {messages: {reportBreadcrumb}}) {
  return (
    <Link to={`/company/${company}/workspace/${workspace}/folder/${folder}/report/${report.id}`} title={reportBreadcrumb}>
      <i className='material-icons'>trending_up</i>
      {report.name}
    </Link>
  )
}

ReportBreadcrumb.displayName = 'Report-Breadcrumb'
ReportBreadcrumb.propTypes = {
  report: PropTypes.shape({
    id: PropTypes.string,
    name: PropTypes.string
  }),
  params: PropTypes.shape({
    company: PropTypes.string,
    workspace: PropTypes.string,
    folder: PropTypes.string
  })
}
ReportBreadcrumb.contextTypes = {
  messages: PropTypes.object
}

export default contextualize(ReportBreadcrumb, 'report')
