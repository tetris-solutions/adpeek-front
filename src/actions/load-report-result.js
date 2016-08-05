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
  if (isEqual(query, moduleCursor.get('query'))) {
    return
  }

  const {tree} = moduleCursor
  let isLoadingCursor = moduleCursor.select('isLoading')

  function releaseCursor () {
    tree.commit()
    isLoadingCursor.release()
    isLoadingCursor = null
    moduleCursor = null
  }

  const myCall = lastCall[id] = Date.now()

  function onSuccess (response) {
    isLoadingCursor.set(false)

    if (lastCall[id] === myCall) {
      moduleCursor.set('result', response.data)
    }

    releaseCursor()

    return response
  }

  function makeTheCall () {
    moduleCursor.set('query', query)

    if (!isvalidReportQuery(query)) {
      moduleCursor.set('result', [])
      releaseCursor()
      return
    }

    isLoadingCursor.set(true)
    tree.commit()

    loadReportModuleResult(query, getApiFetchConfig(tree, token))
      .then(saveResponseTokenAsCookie)
      .then(onSuccess, error => {
        releaseCursor()
        // pass error ahead
        throw error
      })
      .catch(pushResponseErrorToState(tree))
  }

  function waitThenCall () {
    if (lastCall[id] !== myCall) {
      releaseCursor()
    } else {
      makeTheCall()
    }
  }

  if (isLoadingCursor.get()) {
    isLoadingCursor.once('update', waitThenCall)
  } else {
    makeTheCall()
  }
}
