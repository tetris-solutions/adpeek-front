import get from 'lodash/get'
import find from 'lodash/find'

export function findTemplateAdUrl (urls) {
  const htmlUrl = get(find(urls, {key: 'FULL'}), 'value')

  return htmlUrl
    ? htmlUrl.replace('/sadbundle/', '/simgad/').replace('/index.html', '')
    : null
}
