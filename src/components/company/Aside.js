import Message from 'tetris-iso/Message'
import React from 'react'
import PropTypes from 'prop-types'
import {routeParamsBasedBranch} from '../higher-order/branch'
import {Navigation, NavLink, NavBt, NavBts, Name} from '../Navigation'
import Recent from '../Recent'
import ReportLink from '../report/Link'

export const CompanyAside = ({company, params, dispatch}) => {
  const baseUrl = `/c/${company.id}`

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

        <NavLink to={`${baseUrl}/orders`} icon='attach_money'>
          <Message>companyOrders</Message>
        </NavLink>

        <ReportLink tag={NavLink} params={params} reports={company.reports} dispatch={dispatch}>
          <Message>companyReport</Message>
        </ReportLink>

        <NavLink to={`${baseUrl}/mailing`} icon='mail_outline'>
          <Message>reportMailing</Message>
        </NavLink>

        <NavLink to='/' icon='close'>
          <Message>oneLevelUpNavigation</Message>
        </NavLink>
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

export default routeParamsBasedBranch('user', 'company', CompanyAside)
