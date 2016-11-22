import Message from 'tetris-iso/Message'
import React from 'react'
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
          <button type='button' className='mdl-button' disabled>
            <Message>noBudgetRemaining</Message>
          </button>)}
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
