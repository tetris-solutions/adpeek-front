import get from 'lodash/get'
import diff from 'lodash/difference'
import diffBy from 'lodash/differenceBy'
import forEach from 'lodash/forEach'
import omit from 'lodash/omit'
import pick from 'lodash/pick'
import flatten from 'lodash/flatten'
import map from 'lodash/map'
import filter from 'lodash/filter'
import find from 'lodash/find'
import startsWith from 'lodash/startsWith'
import {NEW_BUDGET_PREFIX} from '../components/OrderController'
import isEqual from 'lodash/isEqual'
import {createBudgetAction} from '../actions/create-budget'
import {createOrderAction} from '../actions/create-order'
import {deleteBudgetAction} from '../actions/delete-buget'
import {setCampaignBudgetAction} from '../actions/set-campaign-budget'
import {unsetCampaignBudgetAction} from '../actions/unset-campaign-budget'
import {updateBudgetAction} from '../actions/update-budget'
import {updateOrderAction} from '../actions/update-order'
import {pushSuccessMessageAction} from '../actions/push-success-message-action'
import {loadOrdersAction} from '../actions/load-orders'
import {loadBudgetsAction} from '../actions/load-budgets'
import {loadCampaignsAction} from '../actions/load-campaigns'

const editableBudgetFields = ['name', 'amount', 'percentage']
const editableOrderFields = ['name', 'start', 'end', 'amount', 'auto_budget']

export function persistOrder ({company, workspace, folder}, tree, oldOrder, newOrder) {
  const deletedBudgets = diffBy(oldOrder.budgets, newOrder.budgets, 'id')
  const insertedBudgets = filter(newOrder.budgets, ({id}) => startsWith(id, NEW_BUDGET_PREFIX))
  const notNew = diff(newOrder.budgets, deletedBudgets, insertedBudgets)

  const swappedCampaigns = {}

  const updatedBudgets = filter(notNew, newBudget => {
    const oldBudget = find(oldOrder.budgets, {id: newBudget.id})
    if (!oldBudget) return false

    const insertedCampaigns = diffBy(newBudget.campaigns, oldBudget.campaigns, 'id')
    const deletedCampaigns = diffBy(oldBudget.campaigns, newBudget.campaigns, 'id')

    forEach(insertedCampaigns, ({id}) => {
      swappedCampaigns[id] = newBudget.id
    })

    forEach(deletedCampaigns, ({id}) => {
      swappedCampaigns[id] = swappedCampaigns[id] || null
    })

    return !isEqual(pick(oldBudget, ...editableBudgetFields), pick(newBudget, ...editableBudgetFields))
  })

  function updateCampaigns (budgetId, newCampaigns) {
    const oldCampaigns = get(find(oldOrder.budgets, ({id: budgetId})), 'campaigns') || []
    const deletedCampaigns = diffBy(oldCampaigns, newCampaigns, 'id')
    const insertedCampaigns = diffBy(newCampaigns, oldCampaigns, 'id')

    return Promise.all(flatten([
      map(deletedCampaigns, ({id}) => unsetCampaignBudgetAction(tree, id)),
      map(insertedCampaigns, ({id}) => setCampaignBudgetAction(tree, id, budgetId))
    ]))
  }

  function updateBudgets (orderId) {
    const createBudget = budget => createBudgetAction(tree, orderId, pick(budget, ...editableBudgetFields))
      .then(response => updateCampaigns(response.data.id, budget.campaigns))

    const updateBudget = budget => updateBudgetAction(tree, company, workspace, folder, orderId, pick(budget, 'id', ...editableBudgetFields))
      .then(() => updateCampaigns(budget.id, budget.campaigns))

    return Promise.all(
      flatten([
        map(swappedCampaigns, (budget, campaign) => budget
          ? setCampaignBudgetAction(tree, campaign, budget)
          : unsetCampaignBudgetAction(tree, campaign)),

        map(insertedBudgets, createBudget),
        map(deletedBudgets, ({id}) => deleteBudgetAction(tree, id)),
        map(updatedBudgets, updateBudget)
      ]))

      .then(() => orderId)
  }

  let promise = Promise.resolve()

  if (newOrder.id) {
    if (!isEqual(pick(newOrder, ...editableOrderFields), pick(oldOrder, ...editableOrderFields))) {
      promise = promise.then(() => updateOrderAction(tree, company, workspace, folder, omit(newOrder, 'budgets')))
    }
    promise = promise.then(() => updateBudgets(newOrder.id))
  } else {
    promise = promise.then(() => createOrderAction(tree, folder, omit(newOrder, 'budgets')))
      .then(response => updateBudgets(response.data.id))
  }

  return promise
    .then(orderId =>
      loadOrdersAction(tree, company, workspace, folder)
        .then(() => loadBudgetsAction(tree, company, workspace, folder, orderId))
        .then(() => pushSuccessMessageAction(tree))
        .then(() => loadCampaignsAction(tree, company, workspace, folder))
        .then(() => orderId))
}
