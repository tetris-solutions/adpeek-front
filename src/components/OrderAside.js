import Message from 'tetris-iso/Message'
import React from 'react'
import {Link} from 'react-router'
import Fence from './Fence'
import ContextMenu from './ContextMenu'
import DeleteButton from './DeleteButton'
import {deleteOrderAction} from '../actions/delete-order'
import {contextualize} from './higher-order/contextualize'

const {PropTypes} = React

export function OrderAside ({params: {company, workspace, folder}, order, dispatch}, {router}) {
  const folderUrl = `/company/${company}/workspace/${workspace}/folder/${folder}`

  function onClick () {
    dispatch(deleteOrderAction, order.id)
      .then(() => router.replace(`${folderUrl}/orders`))
  }

  return (
    <Fence canEditOrder>{({canEditOrder}) =>
      <ContextMenu title={order.name} icon='monetization_on'>
        {canEditOrder && <Link className='mdl-navigation__link' to={`${folderUrl}/order/${order.id}`}>
          <i className='material-icons'>mode_edit</i>
          <Message>editOrder</Message>
        </Link>}

        {canEditOrder && <Link className='mdl-navigation__link' to={`${folderUrl}/orders/clone?id=${order.id}`}>
          <i className='material-icons'>content_copy</i>
          <Message>cloneSingleOrder</Message>
        </Link>}

        <Link className='mdl-navigation__link' to={`${folderUrl}/order/${order.id}/autobudget`}>
          <i className='material-icons'>today</i>
          <Message>autoBudgetLog</Message>
        </Link>

        {canEditOrder && <DeleteButton entityName={order.name} className='mdl-navigation__link' onClick={onClick}>
          <i className='material-icons'>delete</i>
          <Message>deleteOrder</Message>
        </DeleteButton>}

        <Link className='mdl-navigation__link' to={`${folderUrl}/orders`}>
          <i className='material-icons'>close</i>
          <Message>oneLevelUpNavigation</Message>
        </Link>
      </ContextMenu>}
    </Fence>
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
