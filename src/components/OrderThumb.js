import React from 'react'
import {Link} from 'react-router'
import {Cap, Title, ThumbLink, Info, Gear} from './ThumbLink'
import {DropdownMenu, MenuItem} from './DropdownMenu'
import {prettyNumber} from '../functions/pretty-number'
import csjs from 'csjs'
import Message from 'tetris-iso/Message'
import {styledFnComponent} from './higher-order/styled-fn-component'

const style = csjs`
.strong {
  display: inline;
  white-space: nowrap;
}`

const {PropTypes} = React
const dFormat = 'DD/MMM'

const Order = ({amount, start, end, company, workspace, folder, id, name, folder_name, workspace_name}, {moment, locales}) => {
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
        <DropdownMenu>
          <MenuItem tag={Link} to={`${folderUrl}/orders/clone?id=${id}`} icon='content_copy'>
            <Message>cloneSingleOrder</Message>
          </MenuItem>

          <MenuItem tag={Link} to={`${orderUrl}/autobudget`} icon='today'>
            <Message>autoBudgetLog</Message>
          </MenuItem>
        </DropdownMenu>
      </Gear>
    </ThumbLink>
  )
}

Order.displayName = 'Order'
Order.propTypes = {
  id: PropTypes.string.isRequired,
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
  locales: PropTypes.string.isRequired
}

export default styledFnComponent(Order, style)
