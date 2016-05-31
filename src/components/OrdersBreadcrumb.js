import React from 'react'
import {Link} from 'react-router'
import Message from '@tetris/front-server/lib/components/intl/Message'

const {PropTypes} = React

export function OrdersBreadcrumb ({params: {company, workspace, folder}}) {
  return (
    <Link to={`/company/${company}/workspace/${workspace}/folder/${folder}/orders`}>
      <Message>orders</Message>
    </Link>
  )
}

OrdersBreadcrumb.displayName = 'Orders-Breadcrumb'
OrdersBreadcrumb.propTypes = {
  params: PropTypes.shape({
    company: PropTypes.string,
    workspace: PropTypes.string,
    folder: PropTypes.string
  })
}

export default OrdersBreadcrumb
