import React from 'react'
import {branch} from 'baobab-react/dist-modules/higher-order'
import Message from '@tetris/front-server/lib/components/intl/Message'

export function App ({user: {name}}) {
  return (
    <div className='container'>
      <h2 className='page-header'>
        <Message name={name}>welcomeMessage</Message>
      </h2>
      <p>The year is 1987 and NASA launches the last of America's deep space probes. In a freak mishap, Ranger 3 and its
        pilot Captain William 'Buck' Rogers are blown out of their trajectory into an orbit which freezes his life
        support system and returns Buck Rogers to Earth five hundred years later.
      </p>
    </div>
  )
}

App.propTypes = {
  user: React.PropTypes.object
}

App.displayName = 'App'

export default branch({user: ['user']}, App)
