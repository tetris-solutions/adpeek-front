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
import round from 'lodash/round'
import without from 'lodash/without'
import random from 'lodash/random'

const {PropTypes} = React
const getCampaignIds = ({campaigns}) => map(campaigns, 'id')
const toPercentage = (value, total) => round((value / total) * 100, 2)
const fromPercentage = (value, total) => round((value / 100) * total, 2)

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
  const exactAmount = ({mode, value}) => mode === 'percentage'
    ? fromPercentage(value, total)
    : value
  return total - sum(map(budgets, exactAmount))
}

function calculateParams (order, selectedBudgetIndex, campaigns) {
  const budget = isNumber(selectedBudgetIndex)
    ? order.budgets[selectedBudgetIndex]
    : null

  const remainingAmount = availableAmount(order.amount, order.budgets)

  const remainingValue = budget && budget.mode === 'percentage'
    ? toPercentage(remainingAmount, order.amount)
    : remainingAmount

  return {
    order,
    budget,
    campaigns: looseCampaigns(campaigns, order.budgets),
    remainingAmount,
    remainingValue
  }
}
const NEW_BUDGET_PREFIX = 'my-new-budget-'

export const Order = React.createClass({
  displayName: 'Order',
  propTypes: {
    order: orderType,
    messages: PropTypes.object,
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

    if (isNumber(changes.value)) {
      const mode = changes.mode || budget.mode

      changes[mode] = changes.value
    }

    this.setCurrentBudget(assign({}, budget, changes))
  },
  changeBudgetMode (mode) {
    const budget = this.getCurrentBudget()
    const {order} = this.state

    this.changeCurrentBudget({
      mode,
      value: mode === 'percentage'
        ? toPercentage(budget.value, order.amount)
        : fromPercentage(budget.value, order.amount),
      [other[mode]]: null
    })
  },
  changeOrderField (field, value) {
    this.setState({
      order: assign({}, this.state.order, {[field]: value})
    })
  },
  changeBudgetField (field, value) {
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
  removeCampaign (campaign) {
    const {campaigns} = this.getCurrentBudget()

    this.changeCurrentBudget({
      campaigns: without(campaigns, campaign)
    })
  },
  createBudget () {
    const {state: {order, selectedBudgetIndex}, props: {folder, messages}} = this
    const {remainingAmount} = calculateParams(order, selectedBudgetIndex, folder.campaigns)
    const newBudget = normalizeBudget({
      id: `${NEW_BUDGET_PREFIX}-${Math.random().toString(36).substr(2)}`,
      name: `${messages.budgetLabel} #${order.budgets.length + 1}`,
      percentage: random(1, toPercentage(remainingAmount, order.amount)),
      campaigns: []
    })

    this.setState({selectedBudgetIndex: order.budgets.length})
    this.changeOrderField('budgets', order.budgets.concat([newBudget]))
  },
  onEnter () {
    // @todo filter by campaign
  },
  render () {
    const {order, budget, campaigns, remainingAmount, remainingValue} = calculateParams(
      this.state.order,
      this.state.selectedBudgetIndex,
      this.props.folder.campaigns
    )

    return (
      <OrderEdit
        createBudget={this.createBudget}
        addCampaigns={this.addCampaigns}
        removeCampaign={this.removeCampaign}
        selectBudget={this.selectBudget}
        changeOrderField={this.changeOrderField}
        changeBudgetField={this.changeBudgetField}
        remainingAmount={remainingAmount}
        remainingValue={remainingValue}
        budget={budget}
        order={order}
        campaigns={campaigns}
        onEnter={this.onEnter}/>
    )
  }
})

export default contextualize(Order, 'folder', 'messages')
