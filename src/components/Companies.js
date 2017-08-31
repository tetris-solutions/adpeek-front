import map from 'lodash/map'
import Message from 'tetris-iso/Message'
import React from 'react'
import PropTypes from 'prop-types'
import {branch, routeParamsBasedBranch} from './higher-order/branch'
import SubHeader from './SubHeader'
import {Container, Gear, Title, ThumbLink} from './ThumbLink'
import {DropdownMenu, MenuItem} from './DropdownMenu'
import {Link} from 'react-router'
import ReportLink from './report/Link'

const Company = ({company: {id, name, reports, icon}, params, dispatch}) => (
  <ThumbLink key={id} title={name} to={`/c/${id}`} img={icon}>
    {icon ? null : <Title>{name}</Title>}
    <Gear>
      <DropdownMenu>
        <ReportLink
          tag={MenuItem}
          params={params}
          reports={reports}
          dispatch={dispatch}>
          <Message>companyReport</Message>
        </ReportLink>

        <MenuItem tag='a' href={`${process.env.FRONT_URL}/dashboard/company/${id}/info`} icon='info_outline'>
          <Message>manageCompany</Message>
        </MenuItem>

        <MenuItem tag={Link} to={`/c/${id}/orders`} icon='attach_money'>
          <Message>companyOrders</Message>
        </MenuItem>
      </DropdownMenu>
    </Gear>
  </ThumbLink>
)

Company.displayName = 'Company'
Company.propTypes = {
  company: PropTypes.shape({
    id: PropTypes.string.isRequired,
    name: PropTypes.string.isRequired,
    reports: PropTypes.array,
    icon: PropTypes.string
  }).isRequired,
  params: PropTypes.object.isRequired,
  dispatch: PropTypes.func.isRequired
}

const CompanyBranch = routeParamsBasedBranch('user', 'company', Company)

const Companies = ({user, dispatch}) => (
  <div>
    <SubHeader title={<Message>companyList</Message>}/>
    <Container>
      {map(user.companies, ({id: company}) =>
        <CompanyBranch
          key={company}
          params={{company}}/>)}
    </Container>
  </div>
)

Companies.displayName = 'Companies'
Companies.propTypes = {
  dispatch: PropTypes.func.isRequired,
  user: PropTypes.shape({
    companies: PropTypes.array
  }).isRequired
}

export default branch('user', Companies)
