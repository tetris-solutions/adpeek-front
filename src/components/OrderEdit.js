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
import OrderCampaigns from './OrderCampaigns'
import {contextualize} from './higher-order/contextualize'
import find from 'lodash/find'
import flatten from 'lodash/flatten'
import includes from 'lodash/includes'
import filter from 'lodash/filter'

const {PropTypes} = React

const getCampaignIds = ({campaigns}) => map(campaigns, 'id')

function looseCampaigns (campaigns, budgets) {
  const takenCampaigns = flatten(map(budgets, getCampaignIds))
  const notTaken = ({id}) => !includes(takenCampaigns, id)

  return filter(campaigns, notTaken)
}

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
    order: orderType,
    folder: PropTypes.shape({
      campaigns: PropTypes.array
    })
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
    if (selectedBudgetIndex === this.state.selectedBudgetIndex) {
      selectedBudgetIndex = null
    }
    this.setState({selectedBudgetIndex})
  },
  getCurrentBudget () {
    const {selectedBudgetIndex, order} = this.state

    return order.budgets[selectedBudgetIndex]
  },
  setCurrentBudget (budget) {
    const {selectedBudgetIndex, order} = this.state
    order.budgets[selectedBudgetIndex] = budget

    this.setState({order})
  },
  changeCurrentBudget (changes) {
    const budget = this.getCurrentBudget()
    const mode = changes.mode || budget.mode

    changes[mode] = changes.value

    this.setCurrentBudget(assign({}, budget, changes))
  },
  changeBudgetMode (mode) {
    this.changeCurrentBudget({
      mode,
      value: 0,
      [other[mode]]: null
    })
  },
  changeField (field, value) {
    if (field === 'mode') {
      this.changeBudgetMode(value)
    } else {
      this.changeCurrentBudget({[field]: value})
    }
  },
  addCampaigns (campaigns) {
    const {folder} = this.props
    const budget = this.getCurrentBudget()

    budget.campaigns = budget.campaigns.concat(map(campaigns,
      id => find(folder.campaigns, {id})))

    this.setCurrentBudget(budget)
  },
  render () {
    const {selectedBudgetIndex} = this.state
    const {order} = this.state
    const budget = order.budgets[selectedBudgetIndex]

    return (
      <div>
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
                change={this.changeField}/>
            ) : null}
          </div>
        </div>

        {selectedBudgetIndex ? (
          <OrderCampaigns
            campaigns={looseCampaigns(this.props.folder.campaigns, order.budgets)}
            addCampaigns={this.addCampaigns}/>
        ) : null}
      </div>
    )
  }
})

export default contextualize(OrderEdit, 'folder')
