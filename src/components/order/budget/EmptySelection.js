import Message from '@tetris/front-server/Message'
import React from 'react'
import PropTypes from 'prop-types'
import {Button, Submit} from '../../Button'
import {Form, Content, Header, Footer} from '../../Card'

function BudgetEmptySelection ({createBudget, amount, available}) {
  function onSubmit (e) {
    e.preventDefault()
    createBudget()
  }

  return (
    <Form onSubmit={onSubmit} size='full'>
      <Header color='blue-grey-500'>
        <Message>emptyBudgetSelectionTitle</Message>
      </Header>

      <Content>
        <Message
          available={available.toFixed(2).toString()}
          amount={amount.toFixed(2).toString()}
          html>emptyBudgetSelectionBody</Message>
      </Content>

      <Footer>
        {available >= 1
          ? (
            <Submit className='mdl-button mdl-button--colored'>
              <Message>createBudget</Message>
            </Submit>
          ) : (
            <Button className='mdl-button' disabled>
              <Message>noBudgetRemaining</Message>
            </Button>)}
      </Footer>
    </Form>
  )
}

BudgetEmptySelection.displayName = 'Budget-Empty-Selection'
BudgetEmptySelection.propTypes = {
  createBudget: PropTypes.func,
  available: PropTypes.number,
  amount: PropTypes.number
}

export default BudgetEmptySelection
