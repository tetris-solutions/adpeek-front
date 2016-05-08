import React from 'react'
import budgetPropTypes from './budget'

const {PropTypes} = React

export default PropTypes.shape({
  name: PropTypes.string,
  start: PropTypes.string,
  end: PropTypes.string,
  auto_budget: PropTypes.bool,
  amount: PropTypes.number,
  budgets: PropTypes.arrayOf(budgetPropTypes)
})
