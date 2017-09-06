import compact from 'lodash/compact'
import {getDeepCursor} from '../functions/get-deep-cursor'

export function touchReport (tree, {company, workspace, folder, report}) {
  const cursor = getDeepCursor(tree, compact([
    'user',
    ['companies', company],
    workspace && ['workspaces', workspace],
    folder && ['folders', folder],
    ['reports', report],
    'last_update'
  ]))

  tree.set(cursor, (new Date()).toISOString())
}
