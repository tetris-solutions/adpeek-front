import join from 'lodash/join'
import assign from 'lodash/assign'
import queryString from 'query-string'
import map from 'lodash/map'

/**
 * parses object query to string
 * @param {Object} query the query in object format
 * @return {String} the stringified query
 */
export function assembleReportQuery (query) {
  query = assign({}, query)

  query.dimensions = join(query.dimensions, ',')
  query.metrics = join(query.metrics, ',')

  query.filters = map(query.filters,
    (values, attributeName) => `${attributeName}(${join(values, '|')})`)

  if (!query.dimensions) delete query.dimensions

  query.filters = join(query.filters, ',')

  return queryString.stringify(query)
}
