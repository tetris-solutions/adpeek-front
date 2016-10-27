import Message from 'tetris-iso/Message'
import React from 'react'
import {Link} from 'react-router'
import compact from 'lodash/compact'
import join from 'lodash/join'

const {PropTypes} = React

export function OrdersBreadcrumb ({params: {company, workspace, folder}}) {
  const scope = join(compact([
    company && `company/${company}`,
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
