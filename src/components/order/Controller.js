import assign from 'lodash/assign'
import cloneDeep from 'lodash/cloneDeep'
import filter from 'lodash/filter'
import find from 'lodash/find'
import findIndex from 'lodash/findIndex'
import flatten from 'lodash/flatten'
import round from 'lodash/round'
import includes from 'lodash/includes'
import isNumber from 'lodash/isNumber'
import map from 'lodash/map'
import sum from 'lodash/sum'
import React from 'react'
import PropTypes from 'prop-types'
import isObject from 'lodash/isObject'
import orderType from '../../propTypes/order'
import OrderEdit from './Form'
import {loadBudgetsAction} from '../../actions/load-budgets'
import {loadOrdersAction} from '../../actions/load-orders'
import {pushSuccessMessageAction} from '../../actions/push-success-message-action'
import {saveOrderAction} from '../../actions/save-order'
import {spawnAutoBudgetAction} from '../../actions/spawn-auto-budget'

const n = num => round(num, 2)

const getCampaignIds = ({campaigns}) => map(campaigns, 'id')
const toPercentage = (value, total) => n((value / total) * 100)
const fromPercentage = (value, total) => n((value / 100) * total)

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
  return n(total - sum(map(budgets, exactAmount)))
}

function defaultBudgetName ({budgetLabel}, index) {
  return `${budgetLabel} #${index}`
}

export class OrderController extends React.Component {
  static displayName = 'Order-Controller'

  static propTypes = {
    route: PropTypes.object.isRequired,
    deliveryMethods: PropTypes.array,
    order: orderType,
    params: PropTypes.shape({
      company: PropTypes.string,
      workspace: PropTypes.string,
      folder: PropTypes.string,
      order: PropTypes.string,
      budget: PropTypes.string
    }),
    dispatch: PropTypes.func,
    campaigns: PropTypes.array
  }

  static contextTypes = {
    router: PropTypes.object,
    messages: PropTypes.object
  }

  state = {
    dirty: false,
    order: normalizeOrder(cloneDeep(this.props.order)),
    selectedBudgetIndex: findIndex(this.props.order.budgets, {id: this.props.params.budget})
  }

  componentDidMount () {
    this.context.router.setRouteLeaveHook(this.props.route, this.onLeave)
    window.addEventListener('beforeunload', this.onUnload)
  }

  componentWillUnmount () {
    window.removeEventListener('beforeunload', this.onUnload)
  }

  onUnload = (e) => {
    if (this.state.dirty) {
      e.returnValue = this.context.messages.leaveOrderPrompt
    }
  }

  onLeave = () => {
    return this.state.dirty
      ? this.context.messages.leaveOrderPrompt
      : true
  }

  updateOrder = (order) => {
    this.setState({order, dirty: true})
  }

  selectBudget = (selectedBudgetIndex) => {
    if (selectedBudgetIndex === this.state.selectedBudgetIndex) {
      selectedBudgetIndex = null
    }
    this.setState({selectedBudgetIndex})
  }

  getCurrentBudget = () => {
    const {selectedBudgetIndex, order} = this.state

    return order.budgets[selectedBudgetIndex]
  }

  setCurrentBudget = (budget) => {
    const {selectedBudgetIndex, order} = this.state
    order.budgets[selectedBudgetIndex] = budget

    this.updateOrder(order)
  }

  changeCurrentBudget = (changes) => {
    this.setCurrentBudget(
      assign(
        {},
        this.getCurrentBudget(),
        changes
      )
    )
  }

  changeBudgetMode = (mode) => {
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
  }

  changeOrderField = (fieldOrChanges, value) => {
    const changes = isObject(fieldOrChanges)
      ? fieldOrChanges
      : {[fieldOrChanges]: value}

    this.updateOrder(assign({}, this.state.order, changes))
  }

  changeBudgetField = (field, value) => {
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
  }

  /**
   * include a list of campaigns in the selected budget
   * @param {Array.<String>} insertedCampaignIds campaign ids
   * @returns {undefined}
   */
  addCampaigns = (insertedCampaignIds) => {
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
  }

  removeCampaign = (campaign) => {
    this.changeCurrentBudget({
      campaigns: filter(this.getCurrentBudget().campaigns,
        ({id}) => id !== campaign.id)
    })
  }

  createBudget = () => {
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

    this.selectBudget(order.budgets.length)
    this.changeOrderField('budgets', order.budgets.concat([newBudget]))
  }

  removeBudget = () => {
    const {selectedBudgetIndex, order} = this.state

    order.budgets.splice(selectedBudgetIndex, 1)

    this.updateOrder(order)
    this.selectBudget(null)
  }

  run = () => {
    const {params, dispatch} = this.props

    dispatch(spawnAutoBudgetAction, params.order)
      .then(() => dispatch(pushSuccessMessageAction))
  }

  save = () => {
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

    const onSuccess = response => {
      this.setState({dirty: false})

      const url = `/company/${params.company}/workspace/${params.workspace}/folder/${params.folder}/order/${response.data.id}`

      const reloadStuff = isNewOrder
        ? dispatch(loadOrdersAction, params.company, params.workspace, params.folder)
        : dispatch(loadBudgetsAction, params.company, params.workspace, params.folder, params.order)

      reloadStuff.then(() => router.push(url))
    }

    return dispatch(saveOrderAction, order)
      .then(onSuccess)
      .then(() => dispatch(pushSuccessMessageAction))
  }

  render () {
    const {campaigns} = this.props
    const {order, selectedBudgetIndex} = this.state
    const budget = isNumber(selectedBudgetIndex)
      ? order.budgets[selectedBudgetIndex]
      : null

    const remainingAmount = availableAmount(order.amount, order.budgets)

    const remainingValue = budget && budget.mode === 'percentage'
      ? toPercentage(remainingAmount, order.amount)
      : remainingAmount

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
        folderCampaigns={looseCampaigns(campaigns, order.budgets)}/>
    )
  }
}

export default OrderController
