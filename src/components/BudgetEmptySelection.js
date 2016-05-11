import React from 'react'
import Message from '@tetris/front-server/lib/components/intl/Message'
import {Form, Content, Header, Footer} from './Card'

const {PropTypes} = React

function BudgetEmptySelection ({
  createBudget,
  amount,
  available
}) {
  function onSubmit (e) {
    e.preventDefault()
    createBudget()
  }

  return (
    <Form onSubmit={onSubmit} size='large'>
      <Header color='blue-grey-500'>
        <Message>emptyBudgetSelectionTitle</Message>
      </Header>
      <Content>

        <Message
          available={available}
          amount={amount}
          html>emptyBudgetSelectionBody</Message>

      </Content>
      <Footer>
        <Message>createBudget</Message>
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
