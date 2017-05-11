import {PUT} from '@tetris/http'
import {saveResponseTokenAsCookie, getApiFetchConfig, pushResponseErrorToState} from 'tetris-iso/utils'
import {getDeepCursor} from '../functions/get-deep-cursor'
import concat from 'lodash/concat'
import assign from 'lodash/assign'
import filter from 'lodash/filter'
import diff from 'lodash/difference'
import map from 'lodash/map'
import includes from 'lodash/includes'
import keyBy from 'lodash/keyBy'

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

      const indexedLanguages = keyBy(languages, 'id')
      const criteria = tree.get(criteriaPath)
      const oldLanguageIds = map(filter(criteria, {type: 'LANGUAGE'}), 'id')
      const newLanguageIds = map(languages, 'id')

      const removedIds = diff(oldLanguageIds, newLanguageIds)
      const insertedIds = diff(newLanguageIds, oldLanguageIds)

      const notInRemovedIds = ({id}) => !includes(removedIds, id)
      const notRemoved = filter(criteria, notInRemovedIds)

      function normalizedCriteria (id) {
        const {name, code} = indexedLanguages[id]

        return {
          id,
          language: name,
          language_code: code,
          type: 'LANGUAGE'
        }
      }

      tree.set(criteriaPath, concat(
        notRemoved,
        map(insertedIds, normalizedCriteria)
      ))

      return response
    })
    .catch(pushResponseErrorToState(tree))
}

