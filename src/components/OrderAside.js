import Message from 'tetris-iso/Message'
import React from 'react'
import {Link} from 'react-router'
import Fence from './Fence'
import DeleteButton from './DeleteButton'
import {deleteOrderAction} from '../actions/delete-order'
import {contextualize} from './higher-order/contextualize'
import {Navigation, Name, NavBt, NavBts} from './Navigation'

export function OrderAside ({params, order, dispatch}, {router}) {
  const {company, workspace, folder} = params
  const folderUrl = `/company/${company}/workspace/${workspace}/folder/${folder}`

  function onClick () {
    router.replace(`${folderUrl}/orders`)
    dispatch(deleteOrderAction, params, order.id)
  }

  return (
    <Fence canEditOrder>{({canEditOrder}) =>
      <Navigation icon='monetization_on'>
        <Name>{order.name}</Name>
        <NavBts>
          {canEditOrder && <NavBt tag={Link} to={`${folderUrl}/orders/clone?id=${order.id}`} icon='content_copy'>
            <Message>cloneSingleOrder</Message>
          </NavBt>}

          <NavBt tag={Link} to={`${folderUrl}/order/${order.id}/autobudget`} icon='today'>
            <Message>autoBudgetLog</Message>
          </NavBt>

          {canEditOrder && <NavBt tag={DeleteButton} entityName={order.name} onClick={onClick} icon='delete'>
            <Message>deleteOrder</Message>
          </NavBt>}

          <NavBt tag={Link} to={`${folderUrl}/orders`} icon='close'>
            <Message>oneLevelUpNavigation</Message>
          </NavBt>
        </NavBts>
      </Navigation>}
    </Fence>
  )
}

OrderAside.displayName = 'Order-Aside'
OrderAside.contextTypes = {
  router: React.PropTypes.object
}
OrderAside.propTypes = {
  dispatch: React.PropTypes.func,
  order: React.PropTypes.shape({
    id: React.PropTypes.string,
    name: React.PropTypes.string
  }),
  params: React.PropTypes.shape({
    company: React.PropTypes.string,
    workspace: React.PropTypes.string,
    folder: React.PropTypes.string
  })
}

export default contextualize(OrderAside, 'order')
