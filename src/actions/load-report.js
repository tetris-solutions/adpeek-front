import {GET} from '@tetris/http'
import {saveResponseTokenAsCookie} from '@tetris/front-server/lib/functions/save-token-as-cookie'
import {getApiFetchConfig} from '@tetris/front-server/lib/functions/get-api-fetch-config'
import {pushResponseErrorToState} from '@tetris/front-server/lib/functions/push-response-error-to-state'
import queryString from 'query-string'
import join from 'lodash/join'
import assign from 'lodash/assign'
import map from 'lodash/map'
import isEqual from 'lodash/isEqual'

function loadReport (query, config) {
  query = assign({}, query)

  query.dimensions = join(query.dimensions, ',')
  query.metrics = join(query.metrics, ',')

  query.filters = map(query.filters,
    (values, attributeName) => `${attributeName}(${join(values, '|')})`)

  if (!query.dimensions) delete query.dimensions

  query.filters = join(query.filters, ',')

  return GET(`${process.env.NUMBERS_API_URL}?${queryString.stringify(query)}`, config)
}

function action (tree, id, query, token) {
  const moduleCursor = tree.select(['reports', 'modules', id])

  if (isEqual(query, moduleCursor.get('query'))) {
    return Promise.resolve()
  }

  return loadReport(query, getApiFetchConfig(tree, token))
    .then(saveResponseTokenAsCookie)
    .then(response => {
      moduleCursor.set('query', query)
      moduleCursor.set('data', response.data)
      tree.commit()

      return response
    })
    .catch(pushResponseErrorToState(tree))
}

function preventRace (fn) {
  let lock = Promise.resolve()

  function single (...args) {
    const fire = () => fn(...args)

    lock = lock.then(fire, fire)

    return lock
  }

  return single
}

export const loadReportAction = preventRace(action)
