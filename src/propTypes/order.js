import React from 'react'
import budgetPropTypes from './budget'

export default React.PropTypes.shape({
  name: React.PropTypes.string,
  start: React.PropTypes.string,
  end: React.PropTypes.string,
  auto_budget: React.PropTypes.bool,
  amount: React.PropTypes.number,
  budgets: React.PropTypes.arrayOf(budgetPropTypes)
})
