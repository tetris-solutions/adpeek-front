import {PUT} from '@tetris/http'
import forEach from 'lodash/forEach'
import assign from 'lodash/assign'
import keyBy from 'lodash/keyBy'
import {saveResponseTokenAsCookie, getApiFetchConfig, pushResponseErrorToState} from 'tetris-iso/utils'
import {getDeepCursor} from '../functions/get-deep-cursor'

function updateCampaignLanguage (id, languages, config) {
  return PUT(`${process.env.ADPEEK_API_URL}/campaign/${id}/criteria/language`, assign({body: languages}, config))
}

export function updateCampaignLanguageAction (tree, {company, workspace, folder, campaign}, languages) {
  return updateCampaignLanguage(campaign, languages, getApiFetchConfig(tree))
    .then(saveResponseTokenAsCookie)
    .then(response => {
      const criteriaPath = getDeepCursor(tree, [
        'user',
        ['companies', company],
        ['workspaces', workspace],
        ['folders', folder],
        ['campaigns', campaign],
        'details',
        'criteria'
      ])

      const campaignCriteria = keyBy(tree.get(criteriaPath), 'id')

      forEach(languages, ({id, name, code}) => {
        if (!campaignCriteria[id]) {
          tree.push(criteriaPath, {
            id,
            language: name,
            language_code: code,
            type: 'LANGUAGE'
          })
        }
      })

      return response
    })
    .catch(pushResponseErrorToState(tree))
}

