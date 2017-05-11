import {PUT} from '@tetris/http'
import {saveResponseTokenAsCookie, getApiFetchConfig, pushResponseErrorToState} from 'tetris-iso/utils'
import {getDeepCursor} from '../functions/get-deep-cursor'
import concat from 'lodash/concat'
import assign from 'lodash/assign'
import filter from 'lodash/filter'
import map from 'lodash/map'
import keyBy from 'lodash/keyBy'

function updateCampaignLanguage (id, languages, config) {
  return PUT(`${process.env.ADPEEK_API_URL}/campaign/${id}/criteria/language`, assign({body: languages}, config))
}

const normalize = ({id, name: language, code: language_code}) => ({
  id,
  language,
  language_code,
  type: 'LANGUAGE'
})

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

      const oldCriteria = tree.get(criteriaPath)

      const indexedLanguages = keyBy(languages, 'id')
      const indexedCriteria = keyBy(oldCriteria, 'id')

      const untouched = ({id, type}) => (
        type !== 'LANGUAGE' ||
        Boolean(indexedLanguages[id])
      )
      const isNew = ({id}) => !indexedCriteria[id]

      const notRemovedCriteria = filter(oldCriteria, untouched)
      const insertedCriteria = map(filter(languages, isNew), normalize)

      tree.set(criteriaPath, concat(notRemovedCriteria, insertedCriteria))

      return response
    })
    .catch(pushResponseErrorToState(tree))
}
