import map from 'lodash/map'
import Message from 'tetris-iso/Message'
import React from 'react'
import {branch} from 'baobab-react/higher-order'
import SubHeader from './SubHeader'
import {ThumbLink} from './ThumbLink'

const {PropTypes} = React

const Companies = ({user}) => (
  <div>
    <SubHeader title={<Message>companyList</Message>}/>
    <div className='mdl-grid'>
      {map(user.companies, ({id, name}) =>
        <ThumbLink key={id} title={name} to={`/company/${id}`}>
          {name}
        </ThumbLink>
      )}
    </div>
  </div>
)

Companies.displayName = 'Companies'
Companies.propTypes = {
  user: PropTypes.shape({
    companies: PropTypes.array
  }).isRequired
}

export default branch({user: ['user']}, Companies)
