import React from 'react'
import {contextualize} from './contextualize'
import every from 'lodash/every'
import join from 'lodash/join'
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

  N.displayName = `notNullable(${join(requiredProps)})`
  N.contextTypes = {
    tree: React.PropTypes.object.isRequired,
    messages: React.PropTypes.object.isRequired
  }

  return N
}

export const requires = (Comp, ...names) => contextualize(notNullable(Comp, ...names), ...names)
