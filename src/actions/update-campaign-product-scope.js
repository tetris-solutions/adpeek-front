import {PUT} from '@tetris/http'
import {saveResponseTokenAsCookie, getApiFetchConfig, pushResponseErrorToState} from '@tetris/front-server/utils'
import assign from 'lodash/assign'

function updateCampaignProductScope (id, productScopes, config) {
  return PUT(`${process.env.ADPEEK_API_URL}/campaign/${id}/criteria/product-scope`, assign({body: productScopes}, config))
}

export function updateCampaignProductScopeAction (tree, {campaign}, productScopes) {
  return updateCampaignProductScope(campaign, productScopes, getApiFetchConfig(tree))
    .then(saveResponseTokenAsCookie)
    .catch(pushResponseErrorToState(tree))
}
