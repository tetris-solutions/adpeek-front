import PropTypes from 'prop-types'
import budgetPropTypes from './budget'

export default PropTypes.shape({
  name: PropTypes.string,
  start: PropTypes.string,
  end: PropTypes.string,
  auto_budget: PropTypes.bool,
  amount: PropTypes.number,
  budgets: PropTypes.arrayOf(budgetPropTypes)
})
