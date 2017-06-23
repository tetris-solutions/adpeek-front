import {GET} from '@tetris/http'
import {saveResponseTokenAsCookie, getApiFetchConfig, pushResponseErrorToState} from 'tetris-iso/utils'
import {saveResponseData} from '../functions/save-response-data'

function loadAdGroupDetails (campaign, adGroup, fresh, config) {
  return GET(`${process.env.ADPEEK_API_URL}/campaign/${campaign}/adgroup/${adGroup}/details${fresh ? '?fresh=true' : ''}`, config)
}

export function loadAdGroupDetailsAction (tree, {company, workspace, folder, campaign, adGroup}, fresh = false) {
  return loadAdGroupDetails(campaign, adGroup, fresh, getApiFetchConfig(tree))
    .then(saveResponseTokenAsCookie)
    .then(saveResponseData(tree, [
      'user',
      ['companies', company],
      ['workspaces', workspace],
      ['folders', folder],
      ['campaigns', campaign],
      ['adGroups', adGroup],
      'details'
    ]))
    .catch(pushResponseErrorToState(tree))
}
