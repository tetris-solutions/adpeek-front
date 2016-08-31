import React from 'react'
import {Link} from 'react-router'

import ContextMenu from './ContextMenu'
import DeleteButton from './DeleteButton'
import {deleteOrderAction} from '../actions/delete-order'
import {contextualize} from './higher-order/contextualize'

const {PropTypes} = React

export function OrderAside ({params: {company, workspace, folder}, order, dispatch}, {router}) {
  const folderUrl = `/company/${company}/workspace/${workspace}/folder/${folder}`

  function onClick () {
    dispatch(deleteOrderAction, order.id)
      .then(() => {
        router.replace(`${folderUrl}/orders`)
      })
  }

  return (
    <ContextMenu title={order.name} icon='monetization_on'>
      <Link
        className='mdl-button mdl-js-button mdl-button--icon'
        to={`${folderUrl}/order/${order.id}`}>

        <i className='material-icons'>mode_edit</i>
      </Link>
      <Link
        className='mdl-button mdl-js-button mdl-button--icon'
        to={`${folderUrl}/order/${order.id}/autobudget`}>

        <i className='material-icons'>today</i>
      </Link>
      <DeleteButton
        entityName={order.name}
        className='mdl-button mdl-js-button mdl-button--icon'
        onClick={onClick}>
        <i className='material-icons'>delete</i>
      </DeleteButton>
    </ContextMenu>
  )
}

OrderAside.displayName = 'Order-Aside'
OrderAside.contextTypes = {
  router: PropTypes.object
}
OrderAside.propTypes = {
  dispatch: PropTypes.func,
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

export default contextualize(OrderAside, 'order')
