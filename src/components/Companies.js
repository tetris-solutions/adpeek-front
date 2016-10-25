import map from 'lodash/map'
import Message from 'tetris-iso/Message'
import React from 'react'
import {branch} from 'baobab-react/higher-order'
import SubHeader from './SubHeader'
import {Container, Gear, Title, ThumbLink} from './ThumbLink'
import {DropdownMenu, MenuItem} from './DrodownMenu'
import {Link} from 'react-router'

const {PropTypes} = React

const Companies = ({user}) => (
  <div>
    <SubHeader title={<Message>companyList</Message>}/>
    <Container>
      {map(user.companies, ({id, name, icon}) =>
        <ThumbLink key={id} title={name} to={`/company/${id}`} img={icon}>
          {icon ? null : <Title>{name}</Title>}
          <Gear>
            <DropdownMenu>
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
  user: PropTypes.shape({
    companies: PropTypes.array
  }).isRequired
}

export default branch({user: ['user']}, Companies)
