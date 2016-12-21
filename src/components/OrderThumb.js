import React from 'react'
import {Link} from 'react-router'
import {Cap, Title, ThumbLink, Info, Gear} from './ThumbLink'
import {DropdownMenu, MenuItem, HeaderMenuItem} from './DropdownMenu'
import {prettyNumber} from '../functions/pretty-number'
import csjs from 'csjs'
import Message from 'tetris-iso/Message'
import {styledFnComponent} from './higher-order/styled-fn-component'
import {DeleteSpan} from './DeleteButton'
import {deleteOrderAction} from '../actions/delete-order'
import {toggleOrderAutoBudgetAction} from '../actions/toggle-order-auto-budget'
import Fence from './Fence'
const style = csjs`
.strong {
  display: inline;
  white-space: nowrap;
}`

const {PropTypes} = React
const dFormat = 'DD/MMM'

const Order = ({dispatch, amount, auto_budget, start, end, company, workspace, folder, id, name, folder_name, workspace_name}, {params, moment, locales}) => {
  const folderUrl = `/company/${company}/workspace/${workspace}/folder/${folder}`
  const orderUrl = `${folderUrl}/order/${id}`

  return (
    <ThumbLink to={orderUrl} title={name}>
      <Cap>
        <strong className={`${style.strong}`}>
          {name}
        </strong>
        <br/>

        <small>
          {moment(start).format(dFormat)} - {moment(end).format(dFormat)}
        </small>
      </Cap>

      <Info>
        <i className='material-icons'>folder</i>
        {folder_name}
        <br/>
        <i className='material-icons'>domain</i>
        {workspace_name}
      </Info>

      <Title>
        {prettyNumber(amount, 'currency', locales)}
      </Title>

      <Gear>
        <Fence canEditOrder>{({canEditOrder}) =>
          <DropdownMenu>
            {canEditOrder &&

            <HeaderMenuItem
              icon={auto_budget ? 'check_box' : 'check_box_outline_blank'}
              onClick={() => dispatch(toggleOrderAutoBudgetAction, params, id)}>
              Auto Budget
            </HeaderMenuItem>}

            {canEditOrder &&
            <MenuItem tag={Link} to={`${folderUrl}/orders/clone?id=${id}`} icon='content_copy'>
              <Message>cloneSingleOrder</Message>
            </MenuItem>}

            <MenuItem tag={Link} to={`${orderUrl}/autobudget`} icon='today'>
              <Message>autoBudgetLog</Message>
            </MenuItem>

            {canEditOrder &&

            <MenuItem
              tag={DeleteSpan}
              entityName={name}
              onClick={() => dispatch(deleteOrderAction, params, id)}
              icon='delete'>
              <Message>deleteOrder</Message>
            </MenuItem>}

          </DropdownMenu>}
        </Fence>
      </Gear>
    </ThumbLink>
  )
}

Order.displayName = 'Order'
Order.propTypes = {
  id: PropTypes.string.isRequired,
  dispatch: PropTypes.func.isRequired,
  auto_budget: PropTypes.bool.isRequired,
  amount: PropTypes.number.isRequired,
  name: PropTypes.string.isRequired,
  folder_name: PropTypes.string.isRequired,
  workspace_name: PropTypes.string.isRequired,
  start: PropTypes.string.isRequired,
  end: PropTypes.string.isRequired,
  workspace: PropTypes.string.isRequired,
  company: PropTypes.string.isRequired,
  folder: PropTypes.string.isRequired
}

Order.contextTypes = {
  moment: PropTypes.func.isRequired,
  locales: PropTypes.string.isRequired,
  params: PropTypes.object.isRequired
}

export default styledFnComponent(Order, style)
