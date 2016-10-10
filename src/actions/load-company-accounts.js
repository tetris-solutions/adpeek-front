import {GET} from '@tetris/http'
import unionBy from 'lodash/unionBy'
import {saveResponseTokenAsCookie, getApiFetchConfig, pushResponseErrorToState} from 'tetris-iso/utils'
import {saveResponseData} from '../functions/save-response-data'

export function loadCompanyAccounts (id, config, platform = null) {
  let url = `${process.env.ADPEEK_API_URL}/company/${id}/accounts`
  if (platform) url += `?platform=${platform}`
  return GET(url, config)
}

const union = (a, b) => unionBy(b, a, 'external_id')

export function loadCompanyAccountsAction (tree, id, platform = null) {
  return loadCompanyAccounts(id, getApiFetchConfig(tree), platform)
    .then(saveResponseTokenAsCookie)
    .then(saveResponseData(tree,
      [
        'user',
        ['companies', id],
        'accounts'
      ], union
    ))
    .catch(pushResponseErrorToState(tree))
}
