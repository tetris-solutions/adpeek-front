import {GET} from '@tetris/http'
import {saveResponseTokenAsCookie, getApiFetchConfig, pushResponseErrorToState} from 'tetris-iso/utils'
import {saveResponseData} from '../functions/save-response-data'
import compact from 'lodash/compact'

function loadAdGroups (level, id, filter, config) {
  return GET(`${process.env.ADPEEK_API_URL}/${level}/${id}/adgroups?filter=${filter}`, config)
}

export function loadAdGroupsAction (tree, {company, workspace, folder, campaign}, filter) {
  const level = campaign ? 'campaign' : 'folder'

  return loadAdGroups(level, campaign || folder, filter, getApiFetchConfig(tree))
    .then(saveResponseTokenAsCookie)
    .then(saveResponseData(tree, compact([
      'user',
      ['companies', company],
      ['workspaces', workspace],
      ['folders', folder],
      campaign && ['campaigns', campaign],
      'adGroups'
    ])))
    .catch(pushResponseErrorToState(tree))
}
