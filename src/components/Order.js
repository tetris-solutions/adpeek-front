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
import round from 'lodash/round'
import without from 'lodash/without'

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
  const exactAmount = ({mode, value}) => mode === 'percentage'
    ? round((value / 100) * total, 2)
    : value
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
        ? round((budget.value / order.amount) * 100, 2)
        : round((budget.value / 100) * order.amount, 2),
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
  onEnter () {
    // @todo filter by campaign
  },
  calculateParams () {
    const {order, selectedBudgetIndex} = this.state
    const budget = order.budgets[selectedBudgetIndex]
    const campaigns = looseCampaigns(this.props.folder.campaigns, order.budgets)
    const remainingAmount = availableAmount(order.amount, order.budgets)
    const remainingValue = get(budget, 'mode') === 'percentage'
      ? round((remainingAmount / order.amount) * 100, 2)
      : remainingAmount

    return {
      order,
      budget,
      campaigns,
      remainingAmount,
      remainingValue
    }
  },
  render () {
    const {order, budget, campaigns, remainingAmount, remainingValue} = this.calculateParams()

    return (
      <OrderEdit
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

export default contextualize(Order, 'folder')
