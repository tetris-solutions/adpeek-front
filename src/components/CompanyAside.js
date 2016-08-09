import React from 'react'
import ContextMenu from './ContextMenu'
import {contextualize} from './higher-order/contextualize'
import {Link} from 'react-router'

const {PropTypes} = React

export const CompanyAside = ({company}) => (
  <ContextMenu title={company.name} icon='account_balance'>
    <a
      className='mdl-button mdl-js-button mdl-button--icon'
      href={`${process.env.FRONT_URL}/dashboard/company/${company.id}/info`}>
      <i className='material-icons'>info_outline</i>
    </a>

    <Link
      className='mdl-button mdl-js-button mdl-button--icon'
      to={`/company/${company.id}/orders`}>
      <i className='material-icons'>attach_money</i>
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
