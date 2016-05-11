import get from 'lodash/get'
import diff from 'lodash/difference'
import diffBy from 'lodash/differenceBy'
import omit from 'lodash/omit'
import pick from 'lodash/pick'
import flatten from 'lodash/flatten'
import map from 'lodash/map'
import filter from 'lodash/filter'
import find from 'lodash/find'
import startsWith from 'lodash/startsWith'
import {NEW_BUDGET_PREFIX} from '../components/Order'
import isEqual from 'lodash/isEqual'
import {createBudgetAction} from '../actions/create-budget'
import {createOrderAction} from '../actions/create-order'
import {deleteBudgetAction} from '../actions/delete-buget'
import {setCampaignBudgetAction} from '../actions/set-campaign-budget'
import {unsetCampaignBudgetAction} from '../actions/unset-campaign-budget'
import {updateBudgetAction} from '../actions/update-budget'
import {updateOrderAction} from '../actions/update-order'

const editableBudgetFields = ['name', 'amount', 'percentage']

export function persistOrder ({company, workspace, folder}, tree, oldOrder, newOrder) {
  const deletedBudgets = diffBy(oldOrder.budgets, newOrder.budgets, 'id')
  const insertedBudgets = filter(newOrder.budgets, ({id}) => startsWith(id, NEW_BUDGET_PREFIX))
  const notNew = diff(newOrder.budgets, deletedBudgets, insertedBudgets)

  const updatedBudgets = filter(notNew, budget => {
    const oldBudget = find(oldOrder.budgets, {id: budget.id})

    return oldBudget && !isEqual(pick(oldBudget, ...editableBudgetFields), pick(budget, ...editableBudgetFields))
  })

  let promise = Promise.resolve()

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

    return Promise.all(flatten([
      map(insertedBudgets, createBudget),
      map(deletedBudgets, ({id}) => deleteBudgetAction(tree, id)),
      map(updatedBudgets, updateBudget)
    ]))
  }

  if (newOrder.id) {
    promise = updateOrderAction(tree, company, workspace, folder, omit(newOrder, 'budgets'))
      .then(() => updateBudgets(newOrder.id))
  } else {
    promise = createOrderAction(tree, folder, omit(newOrder, 'budgets'))
      .then(response => updateBudgets(response.data.id))
  }

  return promise
}
