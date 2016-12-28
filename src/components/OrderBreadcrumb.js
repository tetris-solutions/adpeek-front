import React from 'react'
import {Link} from 'react-router'

import {contextualize} from './higher-order/contextualize'

export function OrderBreadcrumb ({params: {company, workspace, folder}, order}, {messages: {orderBreadcrumb}}) {
  return (
    <Link to={`/company/${company}/workspace/${workspace}/folder/${folder}/order/${order.id}`} title={orderBreadcrumb}>
      <i className='material-icons'>monetization_on</i>
      {order.name}
    </Link>
  )
}

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

export default contextualize(OrderBreadcrumb, 'order')
