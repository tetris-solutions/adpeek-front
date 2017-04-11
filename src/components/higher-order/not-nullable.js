import React from 'react'
import PropTypes from 'prop-types'
import every from 'lodash/every'
import Message from 'tetris-iso/Message'
import {Card, Content, Header, Footer} from '../Card'
import {Link} from 'react-router'

export function notNullable (Component, ...requiredProps) {
  function N (props) {
    const isset = name => Boolean(props[name])

    if (every(requiredProps, isset)) {
      return <Component {...props}/>
    }

    return (
      <Card>
        <Header color='deep-orange'>
          <Message>notFoundTitle</Message>
        </Header>
        <Content>
          <p style={{textAlign: 'center'}}>
            <Message html>notFoundBody</Message>
          </p>
          <br/>
        </Content>
        <Footer multipleButtons>
          <Link className='mdl-button mdl-button--colored' to='/'>
            <Message>errorScreenExit</Message>
          </Link>
        </Footer>
      </Card>
    )
  }

  N.displayName = `guard(${Component.displayName})`
  N.contextTypes = {
    tree: PropTypes.object.isRequired,
    messages: PropTypes.object.isRequired
  }

  return N
}
