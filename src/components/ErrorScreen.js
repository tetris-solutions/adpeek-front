import React from 'react'
import {branch} from 'baobab-react/higher-order'
import {Card, Content, Header, Footer} from './Card'
import {forgetError} from '@tetris/front-server/lib/actions/forget-error-action'
import Message from '@tetris/front-server/lib/components/intl/Message'

const {PropTypes} = React

function ErrorScreen ({error, dispatch}, {router}) {
  function goBack () {
    dispatch(forgetError)
    router.push('/')
  }

  const isAuthError = error.status === 403

  return (
    <Card>
      <Header color={isAuthError ? 'deep-orange' : 'red-900'}>
        {isAuthError
          ? <Message>errorScreenAuthTitle</Message>
          : <Message>errorScreenTitle</Message>}
      </Header>
      <Content>
        <p style={{textAlign: 'center'}}>
          {isAuthError
            ? <Message html>errorScreenAuthBody</Message>
            : <Message html>errorScreenBody</Message>}
        </p>
        <br/>
        <div style={{textAlign: 'right'}}>
          <small>
            <Message>messageFromServer</Message>
            {': '}
            <em>{error.message}</em>
          </small>
        </div>
      </Content>
      <Footer multipleButtons>
        <button className='mdl-button mdl-button--colored' type='button' onClick={goBack}>
          <Message>errorScreenExit</Message>
        </button>
      </Footer>
    </Card>
  )
}

ErrorScreen.displayName = 'Error-Screen'
ErrorScreen.contextTypes = {
  router: PropTypes.object.isRequired
}
ErrorScreen.propTypes = {
  dispatch: PropTypes.func.isRequired,
  error: PropTypes.shape({
    status: PropTypes.number,
    message: PropTypes.string,
    stack: PropTypes.string
  }).isRequired
}
export default branch({error: ['error']}, ErrorScreen)