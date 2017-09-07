import {GET} from '@tetris/http'
import {saveResponseTokenAsCookie, getApiFetchConfig, pushResponseErrorToState} from '@tetris/front-server/utils'
import {saveResponseData} from '../functions/save-response-data'

function loadAdGroupPartitions (campaign, adGroup, config) {
  return GET(`${process.env.ADPEEK_API_URL}/campaign/${campaign}/adGroup/${adGroup}/partitions`, config)
}

export function loadAdGroupPartitionsAction (tree, {company, workspace, folder, campaign, adGroup}) {
  return loadAdGroupPartitions(campaign, adGroup, getApiFetchConfig(tree))
    .then(saveResponseTokenAsCookie)
    .then(saveResponseData(tree, [
      'user',
      ['companies', company],
      ['workspaces', workspace],
      ['folders', folder],
      ['campaigns', campaign],
      ['adGroups', adGroup],
      'partitions'
    ]))
    .catch(pushResponseErrorToState(tree))
}
