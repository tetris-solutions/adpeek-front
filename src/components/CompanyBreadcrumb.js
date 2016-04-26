import React from 'react'
import {Link} from 'react-router'

const {PropTypes} = React

export function CompanyBreadcrumb (props, {company}) {
  if (!company) return null
  return (
    <Link to={`/company/${company.id}`}>
      {company.name}
    </Link>
  )
}

CompanyBreadcrumb.displayName = 'Company-CompanyBreadcrumb'
CompanyBreadcrumb.contextTypes = {
  company: PropTypes.object
}

export default CompanyBreadcrumb
