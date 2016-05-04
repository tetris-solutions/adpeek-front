import {saveResponseData} from './save-response-data'
import {statusResolver} from './status-resolver'
import map from 'lodash/map'

export function saveCampaigns (tree, company, workspace, folder, name = 'campaigns') {
  const setStatus = statusResolver(tree.get('statuses'))
  const transform = ls => map(ls, setStatus)

  return saveResponseData(tree, [
    'user',
    ['companies', company],
    ['workspaces', workspace],
    ['folders', folder],
    name
  ], transform)
}
