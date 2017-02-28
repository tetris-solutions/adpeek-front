import get from 'lodash/get'
import find from 'lodash/find'

export function findImageAdUrl (urls) {
  return get(find(urls, {key: 'PREVIEW'}), 'value')
}
