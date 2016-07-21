import isEmpty from 'lodash/isEmpty'
import get from 'lodash/get'

export function isvalidReportQuery (query) {
  return !isEmpty(get(query, 'metrics')) && !isEmpty(get(query, 'filters.id'))
}
