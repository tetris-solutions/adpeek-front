import React from 'react'
import PropTypes from 'prop-types'
import Link from '../BreadcrumbLink'
import {routeParamsBasedBranch} from '../higher-order/branch'

export const OrderBreadcrumb = ({params: {company, workspace, folder}, order}, {messages: {orderBreadcrumb}}) =>
  <Link to={`/company/${company}/workspace/${workspace}/folder/${folder}/order/${order.id}`} title={orderBreadcrumb}>
    <i className='material-icons'>monetization_on</i>
    {order.name}
  </Link>

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

export default routeParamsBasedBranch('folder', 'order', OrderBreadcrumb)
