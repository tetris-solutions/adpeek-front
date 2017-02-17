import {POST} from '@tetris/http'
import {saveResponseTokenAsCookie, getApiFetchConfig, pushResponseErrorToState} from 'tetris-iso/utils'
import forEach from 'lodash/forEach'
import {getDeepCursor} from '../functions/get-deep-cursor'
import assign from 'lodash/assign'

function loadAdGroupSearchTerms (level, id, adGroups, config) {
  return POST(`${process.env.ADPEEK_API_URL}/${level}/${id}/search-terms`, assign({body: adGroups}, config))
}

export function loadAdGroupSearchTermsAction (tree, {company, workspace, folder, campaign}, adGroups) {
  return loadAdGroupSearchTerms(campaign ? 'campaign' : 'folder', campaign || folder, adGroups, getApiFetchConfig(tree))
    .then(saveResponseTokenAsCookie)
    .then(function onSuccess (response) {
      forEach(response.data, (searchTerms, adGroup) => {
        const path = getDeepCursor(tree, [
          'user',
          ['companies', company],
          ['workspaces', workspace],
          ['folders', folder],
          campaign && ['campaigns', campaign],
          ['adGroups', adGroup],
          'searchTerms'
        ])

        tree.set(path, searchTerms)
      })

      return response
    })
    .catch(pushResponseErrorToState(tree))
}
