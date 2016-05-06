import React from 'react'
import moment from 'moment'
import cloneDeep from 'lodash/cloneDeep'

const {PropTypes} = React

const campaignPropType = PropTypes.shape({
  id: PropTypes.string,
  external_id: PropTypes.string,
  name: PropTypes.string
})

const budgetPropTypes = PropTypes.shape({
  id: PropTypes.string,
  name: PropTypes.string,
  percentage: PropTypes.number,
  amount: PropTypes.number,
  campaigns: PropTypes.arrayOf(campaignPropType)
})

const orderBudgetType = PropTypes.shape({
  name: PropTypes.string,
  start: PropTypes.string,
  end: PropTypes.string,
  auto_budget: PropTypes.bool,
  amount: PropTypes.number,
  budgets: PropTypes.arrayOf(budgetPropTypes)
})

export const OrderEdit = React.createClass({
  displayName: 'Order-Edit',
  propTypes: {
    order: orderBudgetType
  },
  getDefaultProps () {
    return {
      order: {
        name: 'New order',
        start: moment().format('YYYY-MM-DD'),
        end: moment().add(1, 'month').format('YYYY-MM-DD'),
        auto_budget: true,
        amount: 1000,
        budgets: [{
          name: Math.random().toString(36).substr(2),
          percentage: 50,
          campaigns: []
        }]
      }
    }
  },
  getInitialState () {
    return {
      order: cloneDeep(this.props.order)
    }
  },
  render () {
    return (
      <div className='mdl-grid'>
        <div className='mdl-cell mdl-cell--5-col'>
          GRÁFICO
        </div>
        <div className='mdl-cell mdl-cell--7-col'>
          EDIT
        </div>
      </div>
    )
  }
})

export default OrderEdit
