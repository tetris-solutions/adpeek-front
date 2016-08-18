import {GET} from '@tetris/http'
import {saveResponseTokenAsCookie} from '@tetris/front-server/lib/functions/save-token-as-cookie'
import {getApiFetchConfig} from '@tetris/front-server/lib/functions/get-api-fetch-config'
import {pushResponseErrorToState} from '@tetris/front-server/lib/functions/push-response-error-to-state'
import isEqual from 'lodash/isEqual'
import {assembleReportQuery} from '../functions/assemble-report-query'
import {isvalidReportQuery} from '../functions/is-valid-report-query'

function loadReportModuleResult (query, config) {
  return GET(`${process.env.NUMBERS_API_URL}?${assembleReportQuery(query)}`, config)
}

const lastCall = {}

export function loadReportModuleResultAction (moduleCursor, id, query, token) {
  const isCursorOk = () => moduleCursor && moduleCursor.tree
  const sameQuery = () => isEqual(query, moduleCursor.get('query'))

  if (!isCursorOk() || !isvalidReportQuery(query) || sameQuery()) return

  const {tree} = moduleCursor
  const isLoadingCursor = moduleCursor.select('isLoading')
  const myCall = lastCall[id] = Date.now()

  function onSuccess (response) {
    isLoadingCursor.set(false)

    if (isCursorOk()) {
      moduleCursor.set('query', query)
      moduleCursor.set('result', response.data)
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

    loadReportModuleResult(query, getApiFetchConfig(tree, token))
      .then(saveResponseTokenAsCookie)
      .then(onSuccess)
      .catch(pushResponseErrorToState(tree))
  }

  if (isLoadingCursor.get()) {
    isLoadingCursor.once('update', () => {
      if (lastCall[id] === myCall) {
        makeTheCall()
      }
    })
  } else {
    makeTheCall()
  }
}
