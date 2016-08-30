import map from 'lodash/map'
import React from 'react'
import {loadUserCompaniesAction} from '@tetris/front-server/lib/actions/load-user-companies-action'
import {branch} from 'baobab-react/higher-order'

import {ThumbLink} from './ThumbLink'

const {PropTypes} = React

const Home = React.createClass({
  propTypes: {
    user: PropTypes.shape({
      companies: PropTypes.array
    }),
    dispatch: PropTypes.func
  },
  componentWillMount () {
    const {user, dispatch} = this.props
    if (!user) return

    dispatch(loadUserCompaniesAction)
  },
  render () {
    const {user} = this.props
    const {FRONT_URL, ADPEEK_URL} = process.env

    return (
      <div className='mdl-layout mdl-layout--fixed-header'>
        <header className='mdl-layout__header'>
          <div className='mdl-layout__header-row mdl-color--blue-grey-500'>
            <span className='mdl-layout-title'>Adpeek</span>
          </div>
        </header>
        <main className='mdl-layout__content'>
          <div className='page-content'>
            <div className='mdl-grid'>
              {user ? map(user.companies, ({id, name}) =>
                <ThumbLink key={id} title={name} to={`/company/${id}`}>
                  {name}
                </ThumbLink>) : (
                <a className='mdl-button mdl-js-button mdl-button--raised mdl-button--colored' href={`${FRONT_URL}/login?next=${ADPEEK_URL}`}>Login</a>
              )}
            </div>
          </div>
        </main>
        <div className='mdl-layout__obfuscator'/>
      </div>
    )
  }
})

export default branch({
  user: ['user']
}, Home)
