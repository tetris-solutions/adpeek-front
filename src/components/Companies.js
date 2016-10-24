import map from 'lodash/map'
import Message from 'tetris-iso/Message'
import React from 'react'
import {branch} from 'baobab-react/higher-order'
import SubHeader from './SubHeader'
import {Container, Title, ThumbLink} from './ThumbLink'

const {PropTypes} = React

const Companies = ({user}) => (
  <div>
    <SubHeader title={<Message>companyList</Message>}/>
    <Container>
      {map(user.companies, ({id, name, icon}) =>
        <ThumbLink key={id} title={name} to={`/company/${id}`} img={icon}>
          {icon ? null : <Title>{name}</Title>}
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
