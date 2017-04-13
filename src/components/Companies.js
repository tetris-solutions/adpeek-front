import map from 'lodash/map'
import Message from 'tetris-iso/Message'
import React from 'react'
import PropTypes from 'prop-types'
import {branch} from './higher-order/branch'
import SubHeader from './SubHeader'
import {Container, Gear, Title, ThumbLink} from './ThumbLink'
import {DropdownMenu, MenuItem} from './DropdownMenu'
import {Link} from 'react-router'
import ReportLink from './report/Link'

const Companies = ({companies, dispatch}) => (
  <div>
    <SubHeader title={<Message>companyList</Message>}/>
    <Container>
      {map(companies, ({id, name, reports, icon}) =>
        <ThumbLink key={id} title={name} to={`/company/${id}`} img={icon}>
          {icon ? null : <Title>{name}</Title>}
          <Gear>
            <DropdownMenu>
              <ReportLink
                tag={MenuItem}
                params={{company: id}}
                reports={reports}
                dispatch={dispatch}>
                <Message>companyReport</Message>
              </ReportLink>

              <MenuItem tag='a' href={`${process.env.FRONT_URL}/dashboard/company/${id}/info`} icon='info_outline'>
                <Message>manageCompany</Message>
              </MenuItem>

              <MenuItem tag={Link} to={`/company/${id}/orders`} icon='attach_money'>
                <Message>companyOrders</Message>
              </MenuItem>
            </DropdownMenu>
          </Gear>
        </ThumbLink>
      )}
    </Container>
  </div>
)

Companies.displayName = 'Companies'
Companies.propTypes = {
  dispatch: PropTypes.func.isRequired,
  companies: PropTypes.array
}

export default branch({companies: ['user', 'companies']}, Companies)
