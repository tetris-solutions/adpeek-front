import assign from 'lodash/assign'
import head from 'lodash/head'
import isEqual from 'lodash/isEqual'
import forEach from 'lodash/forEach'
import find from 'lodash/find'
import {saveResponseTokenAsCookie, getApiFetchConfig, pushResponseErrorToState} from 'tetris-iso/utils'
import {POST} from '@tetris/http'
import {normalizeResult} from '../functions/normalize-result'
import {getDeepCursor} from '../functions/get-deep-cursor'
import {isvalidReportQuery} from '../functions/is-valid-report-query'
import compact from 'lodash/compact'
import {inferLevelFromParams} from '../functions/infer-level-from-params'

function loadReportModuleResult (query, isCrossPlatform, config) {
  const path = isCrossPlatform ? 'x' : ''

  if (!isCrossPlatform) {
    query = assign({}, query, head(query.accounts))
    delete query.accounts
  }

  return POST(`${process.env.NUMBERS_API_URL}/${path}`, assign({body: query}, config))
}

const lastCall = {}

function dealWithException (tree, params, {message, account: numbersAccount, code}) {
  if (code === 403 && numbersAccount) {
    const nodePath = compact([
      'user',
      ['companies', params.company],
      params.workspace && ['workspaces', params.workspace],
      params.folder && ['folders', params.folder],
      params.workspace ? 'accounts' : 'savedAccounts'
    ])

    const accounts = tree.get(getDeepCursor(tree, nodePath))
    const adPeekAccount = find(accounts, {
      tetris_id: numbersAccount.tetris_account,
      external_id: numbersAccount.ad_account
    })

    if (adPeekAccount) {
      // <error with account "account_id"> => <error with account "account_name">
      message = message.replace(numbersAccount.ad_account, adPeekAccount.name)
    }
  }

  tree.push('alerts', {
    level: 'warning',
    message
  })
}

export function loadReportModuleResultAction (tree, params, id, query, attributes) {
  const isCrossPlatform = inferLevelFromParams(params) !== 'folder'
  const moduleCursor = tree.select(getDeepCursor(tree, compact([
    'user',
    ['companies', params.company],
    params.workspace && ['workspaces', params.workspace],
    params.folder && ['folders', params.folder],
    ['reports', params.report],
    'modules',
    id
  ])))
  const isCursorOk = () => moduleCursor && moduleCursor.tree
  const sameQuery = () => isEqual(query, moduleCursor.get('query'))

  if (!isCursorOk() || !isvalidReportQuery(moduleCursor.get('type'), query) || sameQuery()) return

  const isLoadingCursor = moduleCursor.select('isLoading')
  const myCall = lastCall[id] = Date.now()

  function onSuccess (response) {
    isLoadingCursor.set(false)

    if (isCursorOk()) {
      moduleCursor.set('query', query)
      moduleCursor.set('result', normalizeResult(attributes, response.data.result))
    }

    forEach(response.data.exceptions, e => dealWithException(tree, params, e))

    tree.commit()

    return response
  }

  function makeTheCall () {
    if (!isCursorOk() || sameQuery()) {
      return
    }

    isLoadingCursor.set(true)
    tree.commit()

    loadReportModuleResult(query, isCrossPlatform, getApiFetchConfig(tree))
      .then(saveResponseTokenAsCookie)
      .then(onSuccess)
      .catch(pushResponseErrorToState(tree))
  }

  function makeNextCallOnceFinishedLoading () {
    if (lastCall[id] === myCall) {
      makeTheCall()
    }
  }

  if (isLoadingCursor.get()) {
    isLoadingCursor.once('update', makeNextCallOnceFinishedLoading)
  } else {
    makeTheCall()
  }
}
