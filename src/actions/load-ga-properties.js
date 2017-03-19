import {GET} from '@tetris/http'
import {saveResponseTokenAsCookie, getApiFetchConfig, pushResponseErrorToState} from 'tetris-iso/utils'
import {saveResponseData} from '../functions/save-response-data'

function loadGAProperties (company, tetris_account, ga_account, config) {
  return GET(`${process.env.ADPEEK_API_URL}/company/${company}/account/${tetris_account}/ga_account/${ga_account}/properties`, config)
}

export function loadGAPropertiesAction (tree, {company}, {tetris_id, external_id}) {
  return loadGAProperties(company, tetris_id, external_id, getApiFetchConfig(tree))
    .then(saveResponseTokenAsCookie)
    .then(saveResponseData(tree, [
      'user',
      ['companies', company],
      ['accounts', external_id, 'external_id'],
      'properties'
    ]))
    .catch(pushResponseErrorToState(tree))
}
