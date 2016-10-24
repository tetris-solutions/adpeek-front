import Message from 'tetris-iso/Message'
import React from 'react'
import {Link} from 'react-router'
import {contextualize} from './higher-order/contextualize'
import {Navigation, Button, Buttons, Name} from './Navigation'
import Recent from './Recent'

const {PropTypes} = React

export const CompanyAside = ({company, params, dispatch}) => (
  <Navigation img={company.icon} icon='account_balance'>
    <Name>
      <small><Message>companyName</Message>:</small>
      <br/>
      {company.name}
    </Name>
    <br/>
    <Buttons>
      <Button href={`${process.env.FRONT_URL}/dashboard/company/${company.id}/info`} icon='info_outline'>
        <Message>manageCompany</Message>
      </Button>

      <Button tag={Link} to={`/company/${company.id}/orders`} icon='attach_money'>
        <Message>companyOrders</Message>
      </Button>

      <Button tag={Link} to='/' icon='close'>
        <Message>oneLevelUpNavigation</Message>
      </Button>
    </Buttons>
    <br/>
    <hr/>
    <Recent
      params={params}
      dispatch={dispatch}
      icon='domain'
      level='workspace'
      node={company}/>
  </Navigation>
)

CompanyAside.displayName = 'Company-Aside'
CompanyAside.propTypes = {
  dispatch: PropTypes.func.isRequired,
  params: PropTypes.object.isRequired,
  company: PropTypes.shape({
    id: PropTypes.string,
    name: PropTypes.string
  })
}

export default contextualize(CompanyAside, 'company')
