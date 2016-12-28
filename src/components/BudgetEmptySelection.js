import Message from 'tetris-iso/Message'
import React from 'react'
import {Button} from './Button'
import {Form, Content, Header, Footer} from './Card'

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

      <Footer multipleButtons={available < 1}>
        {available >= 1 ? <Message>createBudget</Message> : (
          <Button className='mdl-button' disabled>
            <Message>noBudgetRemaining</Message>
          </Button>)}
      </Footer>
    </Form>
  )
}

BudgetEmptySelection.displayName = 'Budget-Empty-Selection'
BudgetEmptySelection.propTypes = {
  createBudget: React.PropTypes.func,
  available: React.PropTypes.number,
  amount: React.PropTypes.number
}

export default BudgetEmptySelection
