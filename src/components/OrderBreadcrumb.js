import React from 'react'
import {Link} from 'react-router'

import {contextualize} from './higher-order/contextualize'

const {PropTypes} = React

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
  order: PropTypes.shape({
    id: PropTypes.string,
    name: PropTypes.string
  }),
  params: PropTypes.shape({
    company: PropTypes.string,
    workspace: PropTypes.string,
    folder: PropTypes.string
  })
}
OrderBreadcrumb.contextTypes = {
  messages: PropTypes.object
}

export default contextualize(OrderBreadcrumb, 'order')
