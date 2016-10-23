import map from 'lodash/map'
import React from 'react'
import {branch} from 'baobab-react/higher-order'

import {ThumbLink} from './ThumbLink'

const {PropTypes} = React

const Home = ({user}) => (
  <div className='mdl-layout mdl-layout--fixed-header'>
    <header className='mdl-layout__header'>
      <div className='mdl-layout__header-row mdl-color--blue-A700'>
        <span className='mdl-layout-title'>
          Adpeek
        </span>
      </div>
    </header>
    <main className='mdl-layout__content'>
      <div className='page-content'>
        <div className='mdl-grid'>
          {map(user.companies, ({id, name}) =>
            <ThumbLink key={id} title={name} to={`/company/${id}`}>
              {name}
            </ThumbLink>
          )}
        </div>
      </div>
    </main>
    <div className='mdl-layout__obfuscator'/>
  </div>
)

Home.displayName = 'Home'
Home.propTypes = {
  user: PropTypes.shape({
    companies: PropTypes.array
  }).isRequired
}

export default branch({user: ['user']}, Home)
