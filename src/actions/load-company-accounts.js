import {GET} from '@tetris/http'
import findIndex from 'lodash/findIndex'
import {saveResponseTokenAsCookie} from '@tetris/front-server/lib/functions/save-token-as-cookie'
import {getApiFetchConfig} from '@tetris/front-server/lib/functions/get-api-fetch-config'
import {pushResponseErrorToState} from '@tetris/front-server/lib/functions/push-response-error-to-state'
import isArray from 'lodash/isArray'
import uniqBy from 'lodash/uniqBy'

export function loadCompanyAccounts (id, config, platform = null) {
  let url = `${process.env.ADPEEK_API_URL}/company/${id}/accounts`
  if (platform) url += `?platform=${platform}`
  return GET(url, config)
}

export function loadCompanyAccountsAction (tree, id, platform = null) {
  return loadCompanyAccounts(id, getApiFetchConfig(tree), platform)
    .then(saveResponseTokenAsCookie)
    .then(response => {
      if (!isArray(response.data)) return response

      const companies = tree.get('user', 'companies')
      const index = findIndex(companies, {id})
      const pointer = ['user', 'companies', index, 'accounts']
      const ls = tree.get(pointer) || []

      tree.set(pointer, uniqBy(ls.concat(response.data), 'external_account'))
      tree.commit()

      return response
    })
    .catch(pushResponseErrorToState(tree))
}
