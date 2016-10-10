import {GET} from '@tetris/http'
import {saveResponseTokenAsCookie, getApiFetchConfig, pushResponseErrorToState} from 'tetris-iso/utils'
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
