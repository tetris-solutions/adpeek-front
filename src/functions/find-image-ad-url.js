import get from 'lodash/get'
import find from 'lodash/find'

export function findImageAdUrl (urls, defaultValue = null) {
  return get(find(urls, {key: 'PREVIEW'}), 'value', defaultValue)
}
