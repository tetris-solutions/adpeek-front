import assign from 'lodash/assign'
import isEqual from 'lodash/isEqual'
import map from 'lodash/map'
import mapValues from 'lodash/mapValues'
import find from 'lodash/find'
import {saveResponseTokenAsCookie, getApiFetchConfig, pushResponseErrorToState} from 'tetris-iso/utils'
import {POST} from '@tetris/http'

import {getDeepCursor} from '../functions/get-deep-cursor'
import {isvalidReportQuery} from '../functions/is-valid-report-query'

function loadReportModuleResult (query, config) {
  return POST(`${process.env.NUMBERS_API_URL}`, assign({body: query}, config))
}

const lastCall = {}

/**
 * @param {Object} attributes attributes for type mapping
 * @param {Array} result result array
 * @return {Array} normalized result
 */
function normalizeResult (attributes, result) {
  function eachAttribute (value, field) {
    const attribute = find(attributes, ['id', field])

    if (!attribute) return value

    switch (attribute.id) {
      case 'hourofday':
        const hourOfDayDate = new Date()
        hourOfDayDate.setHours(value)
        hourOfDayDate._format_ = 'HH:mm'
        return hourOfDayDate
      case 'month':
        const monthDate = new Date(value)
        monthDate._format_ = 'MMMM, YY'
        return monthDate
      case 'date':
        const date = new Date(value)
        date._format_ = 'DD - MMM, YY'
        return date
      case 'hourly_stats_aggregated_by_advertiser_time_zone':
      case 'hourly_stats_aggregated_by_audience_time_zone':
        const parts = value.substr(0, '00:00:00'.length)
          .split(':')
          .slice(0, 3)
          .map(Number)

        const hourDate = new Date()
        hourDate.setHours(...parts)
        hourDate._format_ = 'HH:mm'

        return hourDate
    }

    return value
  }

  return map(result, row => mapValues(row, eachAttribute))
}

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
