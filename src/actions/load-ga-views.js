import {GET} from '@tetris/http'
import {saveResponseTokenAsCookie, getApiFetchConfig, pushResponseErrorToState} from 'tetris-iso/utils'
import {saveResponseData} from '../functions/save-response-data'

function loadGAViews (company, tetris_account, ga_account, property, config) {
  return GET(`${process.env.ADPEEK_API_URL}/company/${company}/account/${tetris_account}/ga_account/${ga_account}/property/${property}/views`, config)
}

export function loadGAViewsAction (tree, {company}, {tetris_id, external_id}, property) {
  return loadGAViews(company, tetris_id, external_id, property, getApiFetchConfig(tree))
    .then(saveResponseTokenAsCookie)
    .then(saveResponseData(tree, [
      'user',
      ['companies', company],
      ['accounts', external_id, 'external_id'],
      ['properties', property],
      'views'
    ]))
    .catch(pushResponseErrorToState(tree))
}
