import React from 'react'
import {Link} from 'react-router'
import {node} from './higher-order/branch'

export const OrderBreadcrumb = ({params: {company, workspace, folder}, order}, {messages: {orderBreadcrumb}}) =>
  <Link to={`/company/${company}/workspace/${workspace}/folder/${folder}/order/${order.id}`} title={orderBreadcrumb}>
    <i className='material-icons'>monetization_on</i>
    {order.name}
  </Link>

OrderBreadcrumb.displayName = 'Order-Breadcrumb'
OrderBreadcrumb.propTypes = {
  order: React.PropTypes.shape({
    id: React.PropTypes.string,
    name: React.PropTypes.string
  }),
  params: React.PropTypes.shape({
    company: React.PropTypes.string,
    workspace: React.PropTypes.string,
    folder: React.PropTypes.string
  })
}
OrderBreadcrumb.contextTypes = {
  messages: React.PropTypes.object
}

export default node('folder', 'order', OrderBreadcrumb)
