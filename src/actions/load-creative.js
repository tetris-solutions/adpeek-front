import {getApiFetchConfig} from '@tetris/front-server/lib/functions/get-api-fetch-config'
import {pushResponseErrorToState} from '@tetris/front-server/lib/functions/push-response-error-to-state'
import {saveResponseTokenAsCookie} from '@tetris/front-server/lib/functions/save-token-as-cookie'
import {GET} from '@tetris/http'

import {saveResponseData} from '../functions/save-response-data'

function loadCreative (account, creative, config) {
  return GET(`${process.env.ADPEEK_API_URL}/account/${account}/creative/${creative}`, config)
}

function one (action) {
  let promise = Promise.resolve()

  function exec (...args) {
    const run = () => action(...args)

    promise = promise.then(run, run)

    return promise
  }

  return exec
}

export const loadCreativeAction = one((tree, company, account, creative) =>
  loadCreative(account, creative, getApiFetchConfig(tree))
    .then(saveResponseTokenAsCookie)
    .then(saveResponseData(tree, [
      'user',
      ['companies', company],
      ['creatives', creative]
    ]))
    .catch(pushResponseErrorToState(tree)))