import Message from 'tetris-iso/Message'
import React from 'react'
import {Link} from 'react-router'
import Fence from './Fence'
import DeleteButton from './DeleteButton'
import {deleteOrderAction} from '../actions/delete-order'
import {contextualize} from './higher-order/contextualize'
import {Navigation, Name, Button, Buttons} from './Navigation'

const {PropTypes} = React

export function OrderAside ({params: {company, workspace, folder}, order, dispatch}, {router}) {
  const folderUrl = `/company/${company}/workspace/${workspace}/folder/${folder}`

  function onClick () {
    dispatch(deleteOrderAction, order.id)
      .then(() => router.replace(`${folderUrl}/orders`))
  }

  return (
    <Fence canEditOrder>{({canEditOrder}) =>
      <Navigation icon='monetization_on'>
        <Name>{order.name}</Name>
        <Buttons>
          {canEditOrder && <Button tag={Link} to={`${folderUrl}/order/${order.id}`} icon='mode_edit'>
            <Message>editOrder</Message>
          </Button>}

          {canEditOrder && <Button tag={Link} to={`${folderUrl}/orders/clone?id=${order.id}`} icon='content_copy'>
            <Message>cloneSingleOrder</Message>
          </Button>}

          <Button tag={Link} to={`${folderUrl}/order/${order.id}/autobudget`} icon='today'>
            <Message>autoBudgetLog</Message>
          </Button>

          {canEditOrder && <Button tag={DeleteButton} entityName={order.name} onClick={onClick} icon='delete'>
            <Message>deleteOrder</Message>
          </Button>}

          <Button tag={Link} to={`${folderUrl}/orders`} icon='close'>
            <Message>oneLevelUpNavigation</Message>
          </Button>
        </Buttons>
      </Navigation>}
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
