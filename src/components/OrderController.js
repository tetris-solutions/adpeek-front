import React from 'react'
import find from 'lodash/find'
import flatten from 'lodash/flatten'
import includes from 'lodash/includes'
import filter from 'lodash/filter'
import orderType from '../propTypes/order'
import cloneDeep from 'lodash/cloneDeep'
import isNumber from 'lodash/isNumber'
import assign from 'lodash/assign'
import map from 'lodash/map'
import OrderEdit from './OrderEdit'
import sum from 'lodash/sum'
import round from 'lodash/round'
import without from 'lodash/without'
import {loadBudgetsAction} from '../actions/load-budgets'
import findIndex from 'lodash/findIndex'
import {branch} from 'baobab-react/dist-modules/higher-order'
import {saveOrderAction} from '../actions/save-order'
import {pushSuccessMessageAction} from '../actions/push-success-message-action'
import startsWith from 'lodash/startsWith'

const {PropTypes} = React
const getCampaignIds = ({campaigns}) => map(campaigns, 'id')
const toPercentage = (value, total) => round((value / total) * 100, 2)
const fromPercentage = (value, total) => round((value / 100) * total, 2)

function looseCampaigns (campaigns, budgets) {
  const takenCampaigns = flatten(map(budgets, getCampaignIds))
  const notTaken = ({id, budget}) => !budget && !includes(takenCampaigns, id)

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
  return round(total - sum(map(budgets, exactAmount)), 2)
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

export const NEW_BUDGET_PREFIX = 'my-new-budget'

function defaultBudgetName ({budgetLabel}, index) {
  return `${budgetLabel} #${index}`
}

export const Order = React.createClass({
  displayName: 'Order-Controller',
  propTypes: {
    deliveryMethods: PropTypes.array,
    order: orderType,
    params: PropTypes.shape({
      company: PropTypes.string,
      workspace: PropTypes.string,
      folder: PropTypes.string
    }),
    dispatch: PropTypes.func,
    campaigns: PropTypes.array
  },
  contextTypes: {
    router: PropTypes.object,
    messages: PropTypes.object
  },
  getInitialState () {
    return {
      campaigns: cloneDeep(this.props.campaigns),
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
  /**
   * include a list of campaigns in the selected budget
   * @param {Array.<String>} insertedCampaignIds campaign ids
   * @returns {undefined}
   */
  addCampaigns (insertedCampaignIds) {
    const budget = this.getCurrentBudget()

    const {selectedBudgetIndex, campaigns} = this.state

    budget.campaigns = budget.campaigns.concat(
      map(insertedCampaignIds, id => find(campaigns, {id})))

    const {messages} = this.context
    const didnotChangeName = budget.name === defaultBudgetName(messages, selectedBudgetIndex + 1)

    if (insertedCampaignIds.length === 1 && didnotChangeName) {
      budget.name = find(campaigns, {id: insertedCampaignIds[0]}).name
    }

    this.setCurrentBudget(budget)
  },
  unlockCampaign (id) {
    const campaigns = this.state.campaigns.concat()
    const index = findIndex(campaigns, {id})

    campaigns[index] = assign({}, campaigns[index], {budget: null})

    this.setState({campaigns})
  },
  removeCampaign (campaign) {
    this.unlockCampaign(campaign.id)
    this.changeCurrentBudget({
      campaigns: without(this.getCurrentBudget().campaigns, campaign)
    })
  },
  createBudget () {
    const {deliveryMethods} = this.props
    const {order, selectedBudgetIndex} = this.state

    const {remainingAmount} = calculateParams(order, selectedBudgetIndex, this.state.campaigns)
    const newBudget = normalizeBudget({
      id: `${NEW_BUDGET_PREFIX}-${Math.random().toString(36).substr(2)}`,
      name: defaultBudgetName(this.context.messages, order.budgets.length + 1),
      amount: round(remainingAmount / 2),
      delivery_method: find(deliveryMethods, ({id}) => id !== 'UNKNOWN').id,
      campaigns: []
    })

    this.setState({selectedBudgetIndex: order.budgets.length})
    this.changeOrderField('budgets', order.budgets.concat([newBudget]))
  },
  onEnter () {
    // @todo filter by campaign
  },
  removeBudget () {
    const {selectedBudgetIndex, order} = this.state

    order.budgets.splice(selectedBudgetIndex, 1)

    this.setState({
      order,
      selectedBudgetIndex: null
    })
  },
  save () {
    const {router} = this.context
    const {dispatch, params} = this.props
    const isNewOrder = !params.order
    const order = assign({}, this.state.order)

    order.budgets = map(order.budgets,
      budget => assign(budget, {
        folder: params.folder,
        id: startsWith(budget.id, NEW_BUDGET_PREFIX)
          ? null
          : budget.id
      }))

    return dispatch(saveOrderAction, order)
      .then(response => {
        const url = `/company/${params.company}/workspace/${params.workspace}/folder/${params.folder}/order/${response.data.id}`

        if (isNewOrder) {
          return router.push(url)
        }

        dispatch(loadBudgetsAction, params.company, params.workspace, params.folder, params.order)
          .then(() => router.push(url))
      })
      .then(() => dispatch(pushSuccessMessageAction))
  },
  render () {
    const {order, budget, campaigns, remainingAmount, remainingValue} =
      calculateParams(
        this.state.order,
        this.state.selectedBudgetIndex,
        this.state.campaigns)

    return (
      <OrderEdit
        save={this.save}
        removeBudget={this.removeBudget}
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

export default branch({deliveryMethods: ['deliveryMethods']}, Order)
