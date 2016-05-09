import React from 'react'
import moment from 'moment'
import cloneDeep from 'lodash/cloneDeep'
import OrderPie from './OrderPie'
import orderType from '../propTypes/order'
import OrderHeader from './OrderHeader'
import BudgetEdit from './BudgetEdit'
import assign from 'lodash/assign'
import map from 'lodash/map'
import isNumber from 'lodash/isNumber'

function normalizeBudget (budget) {
  const mode = isNumber(budget.percentage) ? 'percentage' : 'amount'
  const value = budget[mode]

  return assign(budget, {value, mode})
}

function normalizeOrder (order) {
  return assign(order, {budgets: map(order.budgets, normalizeBudget)})
}

const other = {percentage: 'amount', amount: 'percentage'}

export const OrderEdit = React.createClass({
  displayName: 'Order-Edit',
  propTypes: {
    order: orderType
  },
  getDefaultProps () {
    return {
      order: {
        name: 'Campanhas TOP',
        start: moment().format('YYYY-MM-DD'),
        end: moment().add(1, 'month').format('YYYY-MM-DD'),
        auto_budget: true,
        amount: 1000,
        budgets: [{
          name: 'Mc Melody',
          percentage: 50,
          campaigns: []
        }, {
          name: 'Faustão',
          percentage: 30,
          campaigns: []
        }, {
          name: 'Neymar',
          percentage: 20,
          campaigns: []
        }]
      }
    }
  },
  getInitialState () {
    return {
      order: normalizeOrder(cloneDeep(this.props.order)),
      selectedBudgetIndex: null
    }
  },
  selectBudget (selectedBudgetIndex) {
    this.setState({selectedBudgetIndex})
  },
  changeCurrentBudget (changes) {
    const {selectedBudgetIndex, order} = this.state
    const budget = order.budgets[selectedBudgetIndex]
    const mode = changes.mode || budget.mode

    if (changes.value !== undefined) {
      changes[mode] = changes.value
    }

    order.budgets[selectedBudgetIndex] = assign({}, budget, changes)
    this.setState({order})
  },
  changeBudgetMode (mode) {
    this.changeCurrentBudget({
      mode,
      value: 0,
      [other[mode]]: null
    })
  },
  changeBudgetValue (value) {
    this.changeCurrentBudget({value})
  },
  render () {
    const {selectedBudgetIndex} = this.state
    const {order} = this.state
    const budget = order.budgets[selectedBudgetIndex]

    return (
      <div className='mdl-grid'>
        <div className='mdl-cell mdl-cell--5-col'>
          <br/>
          <OrderPie order={order} selectBudget={this.selectBudget}/>
        </div>
        <div className='mdl-cell mdl-cell--7-col'>
          <OrderHeader order={order}/>

          {budget ? (
            <BudgetEdit
              maxAmount={order.amount}
              budget={budget}
              changeMode={this.changeBudgetMode}
              changeValue={this.changeBudgetValue}/>
          ) : null}
        </div>
      </div>
    )
  }
})

export default OrderEdit
