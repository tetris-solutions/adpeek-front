import assign from 'lodash/assign'
import head from 'lodash/head'
import memoize from 'lodash/memoize'
import get from 'lodash/get'
import omit from 'lodash/omit'
import slice from 'lodash/slice'
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
import {isValidReportQuery} from '../functions/is-valid-report-query'
import compact from 'lodash/compact'
import {inferLevelFromParams} from '../functions/infer-level-from-params'
import {replaceCriteriaIdWithName} from './load-location-criteria'

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
const largeResultCache = {}

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

function setQueryIfNone (cursor, query) {
  if (!cursor.exists('query')) {
    cursor.set('query', query)
  }
}

export function loadReportModuleResultAction (tree, params, id, query, attributes) {
  const sortConfig = query.sort

  query = omit(query, 'sort')

  const isCrossPlatform = inferLevelFromParams(params) !== 'folder'
  const moduleCursor = tree.select(getDeepCursor(tree, compact([
    'user',
    ['companies', params.company],
    params.workspace && ['workspaces', params.workspace],
    params.folder && ['folders', params.folder],
    ['reports', params.report],
    ['modules', id]
  ])))

  const isCursorOk = () => moduleCursor && moduleCursor.tree
  const sameQuery = () => isEqual(query, moduleCursor.get('query'))

  if (!isCursorOk() || !isValidReportQuery(moduleCursor.get('type'), query)) {
    return setQueryIfNone(moduleCursor, query)
  }

  const isLoadingCursor = moduleCursor.select('isLoading')
  const myCall = lastCall[id] = Date.now()

  const getSortOptions = memoize(() => {
    const sortCol = find(sortConfig, ([name]) => (
      includes(query.dimensions, name) ||
      includes(query.metrics, name)
    ))

    if (!sortCol) return null

    const [field, order] = sortCol

    return {field, order}
  })

  function reorder (result, field, order) {
    moduleCursor.set('sortCol', {
      field,
      order
    })

    return orderBy(result, [field], [order])
  }

  function sortConfigHasChanged () {
    const sortOpts = getSortOptions()
    const currentSortCol = moduleCursor.get('sortCol')

    return (
      get(sortOpts, 'field') !== get(currentSortCol, 'field') ||
      get(sortOpts, 'order') !== get(currentSortCol, 'order')
    )
  }

  function cropped (result) {
    const sortOpts = getSortOptions()

    if (sortOpts) {
      result = reorder(result, sortOpts.field, sortOpts.order)
    }

    return slice(result, 0, RESULT_LENGTH_LIMIT)
  }

  function updateModuleResult (result) {
    result = isArray(result)
      ? result
      : []

    if (result.length > RESULT_LENGTH_LIMIT) {
      largeResultCache[id] = result

      moduleCursor.set('cropped', {size: result.length})

      result = cropped(result)
    } else {
      delete largeResultCache[id]

      moduleCursor.set('cropped', null)
    }

    return Promise.resolve()
      .then(() => query.entity === 'Location'
        ? replaceCriteriaIdWithName(tree, result)
        : result)
      .then(() => {
        moduleCursor.set('result', normalizeResult(attributes, result))
      })
  }

  function turnOffLoading () {
    isLoadingCursor.set(false)
  }

  function onSuccess (response) {
    turnOffLoading()

    if (isCursorOk()) {
      moduleCursor.set('query', query)
      updateModuleResult(response.data.result)
    }

    forEach(response.data.exceptions,
      e => dealWithException(tree, params, e))

    // tree.commit()

    return response
  }

  function onFailure (err) {
    turnOffLoading()
    moduleCursor.set('query', query)
    moduleCursor.set('result', [])
    moduleCursor.set('responseError', err)
    return Promise.reject(err)
  }

  function dispatchReportRequest () {
    if (!isCursorOk()) return

    if (sameQuery()) {
      if (largeResultCache[id] && sortConfigHasChanged()) {
        updateModuleResult(largeResultCache[id])
        // .then(() => tree.commit())
      }

      return
    }

    moduleCursor.unset('responseError')
    isLoadingCursor.set(true)
    setQueryIfNone(moduleCursor, query)

    // tree.commit()

    loadReportModuleResult(query, isCrossPlatform, getApiFetchConfig(tree))
      .then(saveResponseTokenAsCookie)
      .then(onSuccess, onFailure)
      .catch(pushResponseErrorToState(tree))
  }

  function makeNextCallOnceFinishedLoading () {
    if (lastCall[id] === myCall) { // was not replaced by a new query
      dispatchReportRequest()
    }
  }

  if (isLoadingCursor.get()) {
    isLoadingCursor.once('update', makeNextCallOnceFinishedLoading)
  } else {
    dispatchReportRequest()
  }
}
