import {PUT} from '@tetris/http'
import assign from 'lodash/assign'
import {saveResponseTokenAsCookie, getApiFetchConfig, pushResponseErrorToState} from 'tetris-iso/utils'
import {getDeepCursor} from '../functions/get-deep-cursor'

function updateCampaignOptimizationStatus (id, optimization_status, config) {
  return PUT(`${process.env.ADPEEK_API_URL}/campaign/${id}/optimization-status`, assign({body: {optimization_status}}, config))
}

export function updateCampaignOptimizationStatusAction (tree, {company, workspace, folder, campaign}, optimizationStatus) {
  return updateCampaignOptimizationStatus(campaign, optimizationStatus, getApiFetchConfig(tree))
    .then(saveResponseTokenAsCookie)
    .then(response => {
      const path = getDeepCursor(tree, [
        'user',
        ['companies', company],
        ['workspaces', workspace],
        ['folders', folder],
        ['campaigns', campaign],
        'optimization_status'
      ])
      tree.set(path, optimizationStatus)

      return response
    })
    .catch(pushResponseErrorToState(tree))
}

