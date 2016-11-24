import {POST} from '@tetris/http'
import {saveResponseTokenAsCookie, getApiFetchConfig, pushResponseErrorToState} from 'tetris-iso/utils'
import assign from 'lodash/assign'
import {getDeepCursor} from '../functions/get-deep-cursor'
import compact from 'lodash/compact'
import forEach from 'lodash/forEach'

function loadKeywordsRelevance (folder, keywords, config) {
  return POST(`${process.env.ADPEEK_API_URL}/folder/${folder}/keywords/relevance`, assign({}, config, {body: keywords}))
}

function findKeywordPath (adGroups, keywordId) {
  for (let adGroupIndex = 0; adGroupIndex < adGroups.length; adGroupIndex++) {
    const {keywords} = adGroups[adGroupIndex]

    if (!keywords) continue

    for (let keywordIndex = 0; keywordIndex < keywords.length; keywordIndex++) {
      if (String(keywords[keywordIndex].id) === String(keywordId)) {
        return {adGroupIndex, keywordIndex}
      }
    }
  }
}

export function loadKeywordsRelevanceAction (tree, {company, workspace, folder, campaign}, keywords) {
  return loadKeywordsRelevance(folder, keywords, getApiFetchConfig(tree))
    .then(saveResponseTokenAsCookie)
    .then(function onSuccess (response) {
      const result = response.data

      const adGroupsPath = getDeepCursor(tree, compact([
        'user',
        ['companies', company],
        ['workspaces', workspace],
        ['folders', folder],
        campaign && ['campaigns', campaign],
        'adGroups'
      ]))

      const adGroups = tree.get(adGroupsPath)

      forEach(result, (relevance, keywordId) => {
        const keywordsPath = findKeywordPath(adGroups, keywordId)

        if (keywordsPath) {
          const keywordRelevancePath = adGroupsPath.concat([
            keywordsPath.adGroupIndex,
            'keywords',
            keywordsPath.keywordIndex,
            'relevance'
          ])

          tree.set(keywordRelevancePath, relevance)
        }
      })
    })
    .catch(pushResponseErrorToState(tree))
}
