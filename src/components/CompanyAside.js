import Message from 'tetris-iso/Message'
import React from 'react'
import {Link} from 'react-router'
import {contextualize} from './higher-order/contextualize'
import {Navigation, NavBt, NavBts, Name} from './Navigation'
import Recent from './Recent'
import ReportLink from './Report/LinkToReports'

const {PropTypes} = React

export const CompanyAside = ({company, params, dispatch}) => {
  const baseUrl = `/company/${company.id}`

  return (
    <Navigation img={company.icon} icon='account_balance'>
      <Name>
        <small>
          <Message>companyName</Message>:
        </small>
        <br/>
        {company.name}
      </Name>
      <br/>
      <NavBts>
        <NavBt href={`${process.env.FRONT_URL}/dashboard/company/${company.id}/info`} icon='info_outline'>
          <Message>manageCompany</Message>
        </NavBt>

        <NavBt tag={Link} to={`${baseUrl}/orders`} icon='attach_money'>
          <Message>companyOrders</Message>
        </NavBt>

        <ReportLink params={params} reports={company.reports} dispatch={dispatch}>
          <Message>companyReport</Message>
        </ReportLink>

        <NavBt tag={Link} to='/' icon='close'>
          <Message>oneLevelUpNavigation</Message>
        </NavBt>
      </NavBts>
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
}

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
