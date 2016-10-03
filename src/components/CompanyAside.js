import Message from '@tetris/front-server/lib/components/intl/Message'
import React from 'react'
import {Link} from 'react-router'

import ContextMenu from './ContextMenu'
import {contextualize} from './higher-order/contextualize'

const {PropTypes} = React

export const CompanyAside = ({company}) => (
  <ContextMenu title={company.name} icon='account_balance'>
    <a className='mdl-navigation__link' href={`${process.env.FRONT_URL}/dashboard/company/${company.id}/info`}>
      <i className='material-icons'>info_outline</i>
      <Message>manageCompany</Message>
    </a>

    <Link className='mdl-navigation__link' to={`/company/${company.id}/orders`}>
      <i className='material-icons'>attach_money</i>
      <Message>companyOrders</Message>
    </Link>

    <Link className='mdl-navigation__link' to='/'>
      <i className='material-icons'>close</i>
      <Message>oneLevelUpNavigation</Message>
    </Link>
  </ContextMenu>
)

CompanyAside.displayName = 'Company-Aside'
CompanyAside.propTypes = {
  company: PropTypes.shape({
    id: PropTypes.string,
    name: PropTypes.string
  })
}

export default contextualize(CompanyAside, 'company')
