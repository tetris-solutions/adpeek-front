import React from 'react'
import {Link} from 'react-router'
import {contextualize} from './higher-order/contextualize'

const {PropTypes} = React

export function CompanyBreadcrumb ({company: {id, name}}) {
  return (
    <Link to={`/company/${id}`}>
      {name}
    </Link>
  )
}

CompanyBreadcrumb.displayName = 'Company-Breadcrumb'
CompanyBreadcrumb.propTypes = {
  company: PropTypes.shape({
    id: PropTypes.string,
    name: PropTypes.tring
  })
}

export default contextualize(CompanyBreadcrumb, 'company')
