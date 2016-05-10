import React from 'react'
import find from 'lodash/find'
import flatten from 'lodash/flatten'
import includes from 'lodash/includes'
import filter from 'lodash/filter'
import {contextualize} from './higher-order/contextualize'
import orderType from '../propTypes/order'
import cloneDeep from 'lodash/cloneDeep'
import isNumber from 'lodash/isNumber'
import assign from 'lodash/assign'
import map from 'lodash/map'
import OrderEdit from './OrderEdit'
import defaultOrder from '../mocks/order'
import sum from 'lodash/sum'
import get from 'lodash/get'

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

function availableAmount (total, budgets) {
  const exactAmount = ({mode, value}) => mode === 'percentage' ? (value / 100) * total : value
  return total - sum(map(budgets, exactAmount))
}

export const Order = React.createClass({
  displayName: 'Order',
  propTypes: {
    order: orderType,
    folder: PropTypes.shape({
      campaigns: PropTypes.array
    })
  },
  getDefaultProps () {
    return {
      order: defaultOrder
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
  onEnter () {
    // @todo filter by campaign
  },
  render () {
    const {order, selectedBudgetIndex} = this.state
    const budget = order.budgets[selectedBudgetIndex]
    const campaigns = looseCampaigns(this.props.folder.campaigns, order.budgets)
    const maxAmount = availableAmount(order.amount, order.budgets)
    const budgetMax = get(budget, 'mode') === 'percentage'
      ? (maxAmount / order.amount) * 100
      : maxAmount

    return (
      <OrderEdit
        addCampaigns={this.addCampaigns}
        selectBudget={this.selectBudget}
        changeField={this.changeField}
        budgetMax={budgetMax + (budget ? budget.value : 0)}
        budget={budget}
        order={order}
        campaigns={campaigns}
        onEnter={this.onEnter}/>
    )
  }
})

export default contextualize(Order, 'folder')
