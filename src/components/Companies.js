import map from 'lodash/map'
import Message from 'tetris-iso/Message'
import React from 'react'
import {branch} from 'baobab-react/higher-order'
import SubHeader from './SubHeader'
import {Container, Menu, MenuItem, Title, ThumbLink} from './ThumbLink'
import {Link} from 'react-router'

const {PropTypes} = React

const Companies = ({user}) => (
  <div>
    <SubHeader title={<Message>companyList</Message>}/>
    <Container>
      {map(user.companies, ({id, name, icon}) =>
        <ThumbLink key={id} title={name} to={`/company/${id}`} img={icon}>
          {icon ? null : <Title>{name}</Title>}
          <Menu>
            <MenuItem>
              <a href={`${process.env.FRONT_URL}/dashboard/company/${id}/info`}>
                <i className='material-icons'>info_outline</i>
                <Message>manageCompany</Message>
              </a>
            </MenuItem>
            <MenuItem>
              <Link to={`/company/${id}/orders`}>
                <i className='material-icons'>attach_money</i>
                <Message>companyOrders</Message>
              </Link>
            </MenuItem>
          </Menu>
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
