import {GET} from '@tetris/http'
import {saveResponseTokenAsCookie} from '@tetris/front-server/lib/functions/save-token-as-cookie'
import {getApiFetchConfig} from '@tetris/front-server/lib/functions/get-api-fetch-config'
import {pushResponseErrorToState} from '@tetris/front-server/lib/functions/push-response-error-to-state'
import queryString from 'query-string'
import join from 'lodash/join'
import assign from 'lodash/assign'
import map from 'lodash/map'
import {getDeepCursor} from '../functions/get-deep-cursor'

function loadReportModuleResult (query, config) {
  query = assign({}, query)

  query.dimensions = join(query.dimensions, ',')
  query.metrics = join(query.metrics, ',')

  query.filters = map(query.filters,
    (values, attributeName) => `${attributeName}(${join(values, '|')})`)

  if (!query.dimensions) delete query.dimensions

  query.filters = join(query.filters, ',')

  return GET(`${process.env.NUMBERS_API_URL}?${queryString.stringify(query)}`, config)
}

const lastCall = {}

export function loadReportModuleResultAction (tree, {company, workspace, folder, report}, id, query, token) {
  // @todo make module path dynamic
  const modulePath = getDeepCursor(tree, [
    'user',
    ['companies', company],
    ['workspaces', workspace],
    ['folders', folder],
    ['reports', report],
    ['modules', id]
  ])

  let moduleCursor = tree.select(modulePath)
  let isLoadingCursor = moduleCursor.select('isLoading')

  const myCall = lastCall[id] = Date.now()

  function releaseCursor () {
    moduleCursor.release()
    isLoadingCursor.release()
    isLoadingCursor = null
    moduleCursor = null
  }

  function onSuccess (response) {
    isLoadingCursor.set(false)

    if (lastCall[id] === myCall) {
      moduleCursor.set('result', response.data)
    }

    tree.commit()
    releaseCursor()

    return response
  }

  function makeTheCall () {
    moduleCursor.set('query', query)
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
