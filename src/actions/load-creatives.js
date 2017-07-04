import {GET} from '@tetris/http'
import {saveResponseTokenAsCookie, getApiFetchConfig, pushResponseErrorToState} from 'tetris-iso/utils'
import {saveResponseData} from '../functions/save-response-data'
import compact from 'lodash/compact'
import map from 'lodash/map'
import assign from 'lodash/assign'
import head from 'lodash/head'
import get from 'lodash/get'

function loadAdGroups (level, id, filter, config) {
  return GET(`${process.env.ADPEEK_API_URL}/${level}/${id}/creatives?filter=${filter}`, config)
}

function normalizeTextBasedOnMatchType ({text, match_type}) {
  switch (match_type) {
    case 'EXACT':
      return `[${text}]`
    case 'PHRASE':
      return `"${text}"`
    default:
      return text
  }
}

const normalizeAdGroups = adGroups => map(adGroups,
  adGroup =>
    assign({}, adGroup, {
      keywords: map(adGroup.keywords,
        keyword => assign({}, keyword, {
          final_urls: get(keyword, 'final_urls.urls', null),
          cpc_bid: head(keyword.cpc_bid),
          cpm_bid: head(keyword.cpm_bid),
          status: keyword.status
            ? keyword.status
            : 'ENABLED',
          text: normalizeTextBasedOnMatchType(keyword)
        }))
    }))

export function loadCreativesAction (tree, {company, workspace, folder, campaign}, filter) {
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
    ]), normalizeAdGroups))
    .catch(pushResponseErrorToState(tree))
}
