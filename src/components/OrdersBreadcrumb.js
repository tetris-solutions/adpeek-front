import Message from 'tetris-iso/Message'
import React from 'react'
import {Link} from 'react-router'
import compact from 'lodash/compact'
import join from 'lodash/join'

export function OrdersBreadcrumb ({params: {company, workspace, folder}}) {
  const scope = join(compact([
    `company/${company}`,
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
  params: React.PropTypes.shape({
    company: React.PropTypes.string,
    workspace: React.PropTypes.string,
    folder: React.PropTypes.string
  })
}

export default OrdersBreadcrumb
