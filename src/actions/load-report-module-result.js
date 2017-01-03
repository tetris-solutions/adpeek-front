import assign from 'lodash/assign'
import head from 'lodash/head'
import omit from 'lodash/omit'
import isEqual from 'lodash/isEqual'
import forEach from 'lodash/forEach'
import isArray from 'lodash/isArray'
import find from 'lodash/find'
import orderBy from 'lodash/orderBy'
import includes from 'lodash/includes'
import {saveResponseTokenAsCookie, getApiFetchConfig, pushResponseErrorToState} from 'tetris-iso/utils'
import {POST} from '@tetris/http'
import {normalizeResult} from '../functions/normalize-result'
import {getDeepCursor} from '../functions/get-deep-cursor'
import {isvalidReportQuery} from '../functions/is-valid-report-query'
import compact from 'lodash/compact'
import {inferLevelFromParams} from '../functions/infer-level-from-params'

const RESULT_LENGTH_LIMIT = 1000

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

  if (!isCursorOk() || !isvalidReportQuery(moduleCursor.get('type'), query)) return

  const isLoadingCursor = moduleCursor.select('isLoading')
  const myCall = lastCall[id] = Date.now()

  function cropped (result) {
    const sortCol = find(query.sort, ([name]) => (
      includes(query.dimensions, name) ||
      includes(query.metrics, name)
    ))

    if (sortCol) {
      const [field, order] = sortCol
      result = orderBy(result, [field], [order])
    }

    return result.slice(0, RESULT_LENGTH_LIMIT)
  }

  function saveResult (result) {
    result = isArray(result)
      ? result
      : []

    const tooLarge = result.length > RESULT_LENGTH_LIMIT

    moduleCursor.set('cropped', tooLarge
      ? {size: result.length}
      : false)

    moduleCursor.set('result', normalizeResult(attributes,
      tooLarge ? cropped(result) : result))
  }

  function onSuccess (response) {
    isLoadingCursor.set(false)

    if (isCursorOk()) {
      moduleCursor.set('query', query)
      saveResult(response.data.result)
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

    loadReportModuleResult(omit(query, 'sort'), isCrossPlatform, getApiFetchConfig(tree))
      .then(saveResponseTokenAsCookie)
      .then(onSuccess)
      .catch(pushResponseErrorToState(tree))
  }

  function makeNextCallOnceFinishedLoading () {
    if (lastCall[id] === myCall) {
      makeTheCall()
    }
  }

  if (sameQuery()) {
    saveResult(moduleCursor.get('result'))
    tree.commit()
    return
  }

  if (isLoadingCursor.get()) {
    isLoadingCursor.once('update', makeNextCallOnceFinishedLoading)
  } else {
    makeTheCall()
  }
}
