import {DELETE, PUT} from '@tetris/http'
import {saveResponseTokenAsCookie, getApiFetchConfig, pushResponseErrorToState} from 'tetris-iso/utils'
import {getDeepCursor} from '../functions/get-deep-cursor'
import compact from 'lodash/compact'

function disableAutoBudget (order, config) {
  return DELETE(`${process.env.ADPEEK_API_URL}/order/${order}/autobudget`, config)
}

function enableAutoBudget (order, config) {
  return PUT(`${process.env.ADPEEK_API_URL}/order/${order}/autobudget`, config)
}

export function toggleOrderAutoBudgetAction (tree, {company, workspace, folder}, order) {
  const cursor = getDeepCursor(tree, compact([
    'user',
    ['companies', company],
    workspace && ['workspaces', workspace],
    folder && ['folders', folder],
    ['orders', order],
    'auto_budget'
  ]))
  const autoBudget = tree.get(cursor)
  const action = autoBudget ? disableAutoBudget : enableAutoBudget

  return action(order, getApiFetchConfig(tree))
    .then(saveResponseTokenAsCookie)
    .then(r => {
      cursor.pop()

      tree.merge(cursor, {auto_budget: !autoBudget})
      tree.commit()

      return r
    })
    .catch(pushResponseErrorToState(tree))
}
