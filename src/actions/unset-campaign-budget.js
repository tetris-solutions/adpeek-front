import {PUT} from '@tetris/http'
import {saveResponseTokenAsCookie} from '@tetris/front-server/lib/functions/save-token-as-cookie'
import {getApiFetchConfig} from '@tetris/front-server/lib/functions/get-api-fetch-config'
import {pushResponseErrorToState} from '@tetris/front-server/lib/functions/push-response-error-to-state'
import assign from 'lodash/assign'

export function unsetCampaignBudget (campaign, config) {
  return PUT(`${process.env.ADPEEK_API_URL}/campaign/${campaign}`,
    assign({body: {budget: null}}, config))
}

export function unsetCampaignBudgetAction (tree, campaign) {
  return unsetCampaignBudget(campaign, getApiFetchConfig(tree))
    .then(saveResponseTokenAsCookie)
    .catch(pushResponseErrorToState(tree))
}
