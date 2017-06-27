import React from 'react'
import PropTypes from 'prop-types'
import Link from '../BreadcrumbLink'
import {node} from '../higher-order/branch'

export const CompanyBreadcrumb = ({company: {id, name}}, {messages: {companyBreadcrumb}}) => (
  <Link to={`/company/${id}`} title={companyBreadcrumb}>
    <i className='material-icons'>account_balance</i>
    {name}
  </Link>
)

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

export default node('user', 'company', CompanyBreadcrumb)
