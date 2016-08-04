import React from 'react'
import {Link} from 'react-router'
import {contextualize} from './higher-order/contextualize'

const {PropTypes} = React

export function OrderBreadcrumb ({params: {company, workspace, folder}, report}) {
  return (
    <Link to={`/company/${company}/workspace/${workspace}/folder/${folder}/report/${report.id}`}>
      {report.name}
    </Link>
  )
}

OrderBreadcrumb.displayName = 'Order-Breadcrumb'
OrderBreadcrumb.propTypes = {
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

export default contextualize(OrderBreadcrumb, 'report')
