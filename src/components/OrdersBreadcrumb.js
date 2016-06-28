import React from 'react'
import {Link} from 'react-router'
import Message from '@tetris/front-server/lib/components/intl/Message'

const {PropTypes} = React

export function OrdersBreadcrumb ({params: {company, workspace, folder}}) {
  let url = `/company/${company}`

  if (workspace) {
    url += `/workspace/${workspace}`
    if (folder) {
      url += `/folder/${folder}`
    }
  }
  url += '/orders'

  return (
    <Link to={url}>
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
