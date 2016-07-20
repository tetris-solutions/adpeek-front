import {GET} from '@tetris/http'
import {saveResponseTokenAsCookie} from '@tetris/front-server/lib/functions/save-token-as-cookie'
import {getApiFetchConfig} from '@tetris/front-server/lib/functions/get-api-fetch-config'
import {pushResponseErrorToState} from '@tetris/front-server/lib/functions/push-response-error-to-state'
import queryString from 'query-string'

function loadReport (query, config) {
  return GET(`${process.env.NUMBERS_API_URL}?${queryString.stringify(query)}`, config)
}

export function loadReportAction (tree, id, query, token) {
  return loadReport(query, getApiFetchConfig(tree, token))
    .then(saveResponseTokenAsCookie)
    .then(response => {
      tree.set(['report', id], response.data)

      return response
    })
    .catch(pushResponseErrorToState(tree))
}
