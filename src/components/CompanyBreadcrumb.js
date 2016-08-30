import React from 'react'
import {Link} from 'react-router'

import {contextualize} from './higher-order/contextualize'

const {PropTypes} = React

export function CompanyBreadcrumb ({company: {id, name}}, {messages: {companyBreadcrumb}}) {
  return (
    <Link to={`/company/${id}`} title={companyBreadcrumb}>
      <i className='material-icons'>account_balance</i>
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
CompanyBreadcrumb.contextTypes = {
  messages: PropTypes.object
}

export default contextualize(CompanyBreadcrumb, 'company')
