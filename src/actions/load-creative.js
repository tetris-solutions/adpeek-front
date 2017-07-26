import {saveResponseTokenAsCookie, getApiFetchConfig, pushResponseErrorToState} from 'tetris-iso/utils'
import {GET} from '@tetris/http'

import {saveResponseData} from '../functions/save-response-data'

function loadCreative (company, account, creative, config) {
  return GET(`${process.env.ADPEEK_API_URL}/company/${company}/account/${account}/creative/${creative}`, config)
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

export const loadCreativeAction = one((tree, {company, creative}, account) =>
  loadCreative(company, account, creative, getApiFetchConfig(tree))
    .then(saveResponseTokenAsCookie)
    .then(saveResponseData(tree, [
      'user',
      ['companies', company],
      ['creatives', creative]
    ]))
    .catch(pushResponseErrorToState(tree)))
