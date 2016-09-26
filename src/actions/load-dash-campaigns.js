import {GET} from '@tetris/http'
import {saveResponseTokenAsCookie} from '@tetris/front-server/lib/functions/save-token-as-cookie'
import {getApiFetchConfig} from '@tetris/front-server/lib/functions/get-api-fetch-config'
import {pushResponseErrorToState} from '@tetris/front-server/lib/functions/push-response-error-to-state'
import {saveResponseData} from '../functions/save-response-data'

function loadDashCampaigns (company, config) {
  return GET(`${process.env.ADPEEK_API_URL}/company/${company}/campaigns/dash`, config)
}

export function loadDashCampaignsAction (tree, company, token) {
  return loadDashCampaigns(company, getApiFetchConfig(tree, token))
    .then(saveResponseTokenAsCookie)
    .then(saveResponseData(tree, [
      'user',
      ['companies', company],
      'dashCampaigns'
    ]))
    .catch(pushResponseErrorToState(tree))
}
