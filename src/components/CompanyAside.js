import Message from 'tetris-iso/Message'
import React from 'react'
import {Link} from 'react-router'
import {contextualize} from './higher-order/contextualize'
import {Navigation, Button} from './Navigation'
const {PropTypes} = React

export const CompanyAside = ({company}) => (
  <Navigation img={company.icon} icon='info_outline'>
    <h4>
      <small>Nome da empresa:</small>
      <br/>
      {company.name}
    </h4>

    <Button href={`${process.env.FRONT_URL}/dashboard/company/${company.id}/info`} icon='info_outline'>
      <Message>manageCompany</Message>
    </Button>

    <Button tag={Link} to={`/company/${company.id}/orders`} icon='attach_money'>
      <Message>companyOrders</Message>
    </Button>

    <Button tag={Link} to='/' icon='close'>
      <Message>oneLevelUpNavigation</Message>
    </Button>
  </Navigation>
)

CompanyAside.displayName = 'Company-Aside'
CompanyAside.propTypes = {
  company: PropTypes.shape({
    id: PropTypes.string,
    name: PropTypes.string
  })
}

export default contextualize(CompanyAside, 'company')
