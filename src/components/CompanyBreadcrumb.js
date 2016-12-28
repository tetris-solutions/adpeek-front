import React from 'react'
import {Link} from 'react-router'

import {contextualize} from './higher-order/contextualize'

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
  company: React.PropTypes.shape({
    id: React.PropTypes.string,
    name: React.PropTypes.tring
  })
}
CompanyBreadcrumb.contextTypes = {
  messages: React.PropTypes.object
}

export default contextualize(CompanyBreadcrumb, 'company')
