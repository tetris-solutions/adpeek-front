import isEmpty from 'lodash/isEmpty'
import get from 'lodash/get'

export function isvalidReportQuery (query) {
  const isInvalid = (
    isEmpty(get(query, 'dimensions')) ||
    isEmpty(get(query, 'metrics')) ||
    isEmpty(get(query, 'filters.id'))
  )

  return !isInvalid
}
