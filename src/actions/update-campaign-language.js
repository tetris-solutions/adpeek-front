import {PUT} from '@tetris/http'
import {saveResponseTokenAsCookie, getApiFetchConfig, pushResponseErrorToState} from 'tetris-iso/utils'
import assign from 'lodash/assign'

function updateCampaignLanguage (id, languages, config) {
  return PUT(`${process.env.ADPEEK_API_URL}/campaign/${id}/criteria/language`, assign({body: languages}, config))
}

export function updateCampaignLanguageAction (tree, {campaign}, languages) {
  return updateCampaignLanguage(campaign, languages, getApiFetchConfig(tree))
    .then(saveResponseTokenAsCookie)
    .catch(pushResponseErrorToState(tree))
}
