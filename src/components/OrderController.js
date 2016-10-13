import assign from 'lodash/assign'
import cloneDeep from 'lodash/cloneDeep'
import filter from 'lodash/filter'
import find from 'lodash/find'
import flatten from 'lodash/flatten'
import floor from 'lodash/floor'
import includes from 'lodash/includes'
import isNumber from 'lodash/isNumber'
import map from 'lodash/map'
import sum from 'lodash/sum'
import without from 'lodash/without'
import React from 'react'
import isObject from 'lodash/isObject'
import orderType from '../propTypes/order'
import OrderEdit from './OrderEdit'
import {loadBudgetsAction} from '../actions/load-budgets'
import {loadOrdersAction} from '../actions/load-orders'
import {pushSuccessMessageAction} from '../actions/push-success-message-action'
import {saveOrderAction} from '../actions/save-order'
import {spawnAutoBudgetAction} from '../actions/spawn-auto-budget'

const {PropTypes} = React
const getCampaignIds = ({campaigns}) => map(campaigns, 'id')
const toPercentage = (value, total) => floor((value / total) * 100, 2)
const fromPercentage = (value, total) => floor((value / 100) * total, 2)

function looseCampaigns (campaigns, budgets) {
  const takenCampaigns = flatten(map(budgets, getCampaignIds))
  const notTaken = ({id, budget}) => !includes(takenCampaigns, id)

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

function availableAmount (total, budgets) {
  const exactAmount = ({mode, value}) => mode === 'percentage'
    ? fromPercentage(value, total)
    : value
  return floor(total - sum(map(budgets, exactAmount)), 2)
}

function defaultBudgetName ({budgetLabel}, index) {
  return `${budgetLabel} #${index}`
}

export const OrderController = React.createClass({
  displayName: 'Order-Controller',
  propTypes: {
    deliveryMethods: PropTypes.array,
    order: orderType,
    params: PropTypes.shape({
      company: PropTypes.string,
      workspace: PropTypes.string,
      folder: PropTypes.string,
      order: PropTypes.string
    }),
    dispatch: PropTypes.func,
    campaigns: PropTypes.array,
    maxCampaignsPerBudget: PropTypes.number
  },
  contextTypes: {
    router: PropTypes.object,
    messages: PropTypes.object
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
    this.setCurrentBudget(
      assign(
        {},
        this.getCurrentBudget(),
        changes
      )
    )
  },
  changeBudgetMode (mode) {
    const budget = this.getCurrentBudget()
    const {order} = this.state
    const changes = {mode}

    if (mode === 'percentage') {
      changes.percentage = changes.value = toPercentage(budget.value, order.amount)
      changes.amount = null
    } else {
      changes.amount = changes.value = fromPercentage(budget.value, order.amount)
      changes.percentage = null
    }

    this.changeCurrentBudget(changes)
  },
  changeOrderField (fieldOrChanges, value) {
    const changes = isObject(fieldOrChanges)
      ? fieldOrChanges
      : {[fieldOrChanges]: value}

    const order = assign({}, this.state.order, changes)

    this.setState({order})
  },
  changeBudgetField (field, value) {
    if (field === 'mode') {
      this.changeBudgetMode(value)
    } else if (field === 'value') {
      const budget = this.getCurrentBudget()

      this.changeCurrentBudget({
        value,
        [budget.mode]: value
      })
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

    const {campaigns} = this.props
    const {selectedBudgetIndex} = this.state

    budget.campaigns = budget.campaigns.concat(
      map(insertedCampaignIds, id => find(campaigns, {id})))

    const {messages} = this.context
    const didnotChangeName = budget.name === defaultBudgetName(messages, selectedBudgetIndex + 1)

    if (insertedCampaignIds.length === 1 && didnotChangeName) {
      budget.name = find(campaigns, {id: insertedCampaignIds[0]}).name
    }

    this.setCurrentBudget(budget)
  },
  removeCampaign (campaign) {
    this.changeCurrentBudget({
      campaigns: without(this.getCurrentBudget().campaigns, campaign)
    })
  },
  createBudget () {
    const {deliveryMethods} = this.props
    const {order} = this.state
    const remainingAmount = availableAmount(order.amount, order.budgets)

    const newBudget = normalizeBudget({
      isNewBudget: true,
      id: `NewBudget::${Math.random().toString(36).substr(2)}`,
      name: defaultBudgetName(this.context.messages, order.budgets.length + 1),
      amount: remainingAmount,
      delivery_method: find(deliveryMethods, ({id}) => id !== 'UNKNOWN').id,
      campaigns: []
    })

    this.setState({selectedBudgetIndex: order.budgets.length})
    this.changeOrderField('budgets', order.budgets.concat([newBudget]))
  },
  removeBudget () {
    const {selectedBudgetIndex, order} = this.state

    order.budgets.splice(selectedBudgetIndex, 1)

    this.setState({
      order,
      selectedBudgetIndex: null
    })
  },
  run () {
    const {params, dispatch} = this.props

    dispatch(spawnAutoBudgetAction, params.order)
  },
  save () {
    const {router} = this.context
    const {dispatch, params} = this.props
    const isNewOrder = !params.order
    const order = assign({}, this.state.order)

    order.budgets = map(order.budgets,
      budget => assign(budget, {
        id: budget.isNewBudget
          ? null
          : budget.id
      }))

    order.folder = params.folder

    function onSuccess (response) {
      const url = `/company/${params.company}/workspace/${params.workspace}/folder/${params.folder}/order/${response.data.id}`

      const reloadStuff = isNewOrder
        ? dispatch(loadOrdersAction, params.company, params.workspace, params.folder)
        : dispatch(loadBudgetsAction, params.company, params.workspace, params.folder, params.order)

      reloadStuff.then(() => router.push(url))
    }

    return dispatch(saveOrderAction, order)
      .then(onSuccess)
      .then(() => dispatch(pushSuccessMessageAction))
  },
  render () {
    const {campaigns, maxCampaignsPerBudget} = this.props
    const {order, selectedBudgetIndex} = this.state
    const budget = isNumber(selectedBudgetIndex)
      ? order.budgets[selectedBudgetIndex]
      : null

    const remainingAmount = availableAmount(order.amount, order.budgets)

    const remainingValue = budget && budget.mode === 'percentage'
      ? toPercentage(remainingAmount, order.amount)
      : remainingAmount

    const showFolderCampaigns = !(budget && budget.campaigns.length >= maxCampaignsPerBudget)
    let folderCampaigns = []

    if (showFolderCampaigns && budget) {
      folderCampaigns = looseCampaigns(campaigns, order.budgets)
    }

    return (
      <OrderEdit
        save={this.save}
        runAutoBudget={this.run}
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
        showFolderCampaigns={showFolderCampaigns}
        folderCampaigns={folderCampaigns}/>
    )
  }
})

export default OrderController
