import Message from 'tetris-iso/Message'
import React from 'react'
import {Link} from 'react-router'
import {contextualize} from './higher-order/contextualize'
import {Navigation, Button, Buttons, Name} from './Navigation'
import Recent from './Recent'
import isEmpty from 'lodash/isEmpty'
import Fence from './Fence'

const {PropTypes} = React

export const CompanyAside = ({company, params, dispatch}) => {
  const baseUrl = `/company/${company.id}`
  const linkToReportList = isEmpty(company.reports)
  const reportUrl = `${baseUrl}/${linkToReportList ? 'reports' : 'report/' + company.reports[0].id}`

  return (
    <Fence canBrowseReports>{({canBrowseReports}) =>
      <Navigation img={company.icon} icon='account_balance'>
        <Name>
          <small>
            <Message>companyName</Message>:
          </small>
          <br/>
          {company.name}
        </Name>
        <br/>
        <Buttons>
          <Button href={`${process.env.FRONT_URL}/dashboard/company/${company.id}/info`} icon='info_outline'>
            <Message>manageCompany</Message>
          </Button>

          <Button tag={Link} to={`${baseUrl}/orders`} icon='attach_money'>
            <Message>companyOrders</Message>
          </Button>

          {(canBrowseReports || !linkToReportList) && (
            <Button tag={Link} to={reportUrl} icon='show_chart'>
              <Message>companyReport</Message>
            </Button>)}

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
    }</Fence>
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
