import isEmpty from 'lodash/isEmpty'
import get from 'lodash/get'

export function isvalidReportQuery (type, query) {
  const isInvalid = (
    (isEmpty(get(query, 'dimensions')) && type !== 'total') ||
    isEmpty(get(query, 'metrics')) ||
    isEmpty(get(query, 'filters.id'))
  )

  return !isInvalid
}
