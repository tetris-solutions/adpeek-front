import Message from 'tetris-iso/Message'
import React from 'react'
import PropTypes from 'prop-types'
import {Link} from 'react-router'
import Fence from '../Fence'
import DeleteButton from '../DeleteButton'
import {deleteOrderAction} from '../../actions/delete-order'
import {routeParamsBasedBranch} from '../higher-order/branch'
import {Navigation, Name, NavBt, NavBts} from '../Navigation'

export function OrderAside ({params, order, dispatch}, {router}) {
  const {company, workspace, folder} = params
  const folderUrl = `/company/${company}/workspace/${workspace}/folder/${folder}`

  function onClick () {
    dispatch(deleteOrderAction, params, order.id)
      .then(() => {
        router.replace(`${folderUrl}/orders`)
      })
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

export default routeParamsBasedBranch('folder', 'order', OrderAside)
