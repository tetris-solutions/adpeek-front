import Message from 'tetris-iso/Message'
import React from 'react'
import PropTypes from 'prop-types'
import Link from '../../BreadcrumbLink'
import compact from 'lodash/compact'
import join from 'lodash/join'

export function OrdersBreadcrumb ({params: {company, workspace, folder}}) {
  const scope = join(compact([
    `c/${company}`,
    workspace && `workspace/${workspace}`,
    folder && `folder/${folder}`
  ]), '/')

  const url = `/${scope}/orders`
  return (
    <Link to={url}>
      <i className='material-icons'>list</i>
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
