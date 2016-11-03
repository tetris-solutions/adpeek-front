import assign from 'lodash/assign'
import isEqual from 'lodash/isEqual'
import {saveResponseTokenAsCookie, getApiFetchConfig, pushResponseErrorToState} from 'tetris-iso/utils'
import {POST} from '@tetris/http'
import {normalizeResult} from '../functions/normalize-result'
import {getDeepCursor} from '../functions/get-deep-cursor'
import {isvalidReportQuery} from '../functions/is-valid-report-query'

function loadReportModuleResult (query, config) {
  return POST(`${process.env.NUMBERS_API_URL}`, assign({body: query}, config))
}

const lastCall = {}

export function loadReportModuleResultAction (tree, params, id, query, attributes) {
  const moduleCursor = tree.select(getDeepCursor(tree, [
    'user',
    ['companies', params.company],
    ['workspaces', params.workspace],
    ['folders', params.folder],
    ['reports', params.report],
    'modules',
    id
  ]))
  const isCursorOk = () => moduleCursor && moduleCursor.tree
  const sameQuery = () => isEqual(query, moduleCursor.get('query'))

  if (!isCursorOk() || !isvalidReportQuery(query) || sameQuery()) return

  const isLoadingCursor = moduleCursor.select('isLoading')
  const myCall = lastCall[id] = Date.now()

  function onSuccess (response) {
    isLoadingCursor.set(false)

    if (isCursorOk()) {
      moduleCursor.set('query', query)
      moduleCursor.set('result', normalizeResult(attributes, response.data))
    }

    tree.commit()

    return response
  }

  function makeTheCall () {
    if (!isCursorOk() || sameQuery()) {
      return
    }

    isLoadingCursor.set(true)
    tree.commit()

    loadReportModuleResult(query, getApiFetchConfig(tree))
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
