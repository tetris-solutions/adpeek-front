import React from 'react'
import {Link} from 'react-router'
import {node} from './higher-order/branch'

export const CompanyBreadcrumb = ({company: {id, name}}, {messages: {companyBreadcrumb}}) =>
  <Link to={`/company/${id}`} title={companyBreadcrumb}>
    <i className='material-icons'>account_balance</i>
    {name}
  </Link>

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

export default node('user', 'company', CompanyBreadcrumb)
