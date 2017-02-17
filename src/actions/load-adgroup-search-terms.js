import {GET} from '@tetris/http'
import {saveResponseTokenAsCookie, getApiFetchConfig, pushResponseErrorToState} from 'tetris-iso/utils'
import {saveResponseData} from '../functions/save-response-data'

function loadAdgroupSearchTerms (campaign, adGroup, config) {
  return GET(`${process.env.ADPEEK_API_URL}/campaign/${campaign}/adgroup/${adGroup}/search-terms`, config)
}

export function loadAdgroupSearchTermsAction (tree, {company, workspace, folder, campaign, adGroup}) {
  return loadAdgroupSearchTerms(campaign, adGroup, getApiFetchConfig(tree))
    .then(saveResponseTokenAsCookie)
    .then(saveResponseData(tree, [
      'user',
      ['companies', company],
      ['workspaces', workspace],
      folder && ['folder', folder],
      ['campaigns', campaign],
      ['adGroups', adGroup],
      'searchTerms'
    ]))
    .catch(pushResponseErrorToState(tree))
}
