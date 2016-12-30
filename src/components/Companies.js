import map from 'lodash/map'
import Message from 'tetris-iso/Message'
import React from 'react'
import {branch} from 'baobab-react/higher-order'
import SubHeader from './SubHeader'
import {Container, Gear, Title, ThumbLink} from './ThumbLink'
import {DropdownMenu, MenuItem} from './DropdownMenu'
import {Link} from 'react-router'
import ReportLink from './Report/ReportLink'

const Companies = ({user, dispatch}) => (
  <div>
    <SubHeader title={<Message>companyList</Message>}/>
    <Container>
      {map(user.companies, ({id, name, reports, icon}) =>
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
  dispatch: React.PropTypes.func.isRequired,
  user: React.PropTypes.shape({
    companies: React.PropTypes.array
  }).isRequired
}

export default branch({user: ['user']}, Companies)
